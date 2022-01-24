'use strict'
const appRoot = require( 'app-root-path' )
const crs = require( 'crypto-random-string' )
const knex = require( `${appRoot}/db/knex` )
const sanitizeHtml = require( 'sanitize-html' )

const { getUserByEmail, getUserById } = require( `${appRoot}/modules/core/services/users` )

const { getServerInfo } = require( `${appRoot}/modules/core/services/generic` )
const { sendEmail } = require( `${appRoot}/modules/emails` )

const { grantPermissionsStream } = require( `${appRoot}/modules/core/services/streams` )

const Invites = () => knex( 'server_invites' )

module.exports = {
  async createAndSendInvite( { email, inviterId, message, resourceTarget, resourceId, role } ) {
    // check if email is already registered as a user
    email = email.toLowerCase()
    let existingUser = await getUserByEmail( { email } )

    if ( existingUser ) throw new Error( 'This email is already associated with an account on this server!' )

    if ( message ) {
      if ( message.length >= 1024 ) {
        throw new Error( 'Personal message too long.' )
      }

      message = module.exports.sanitizeMessage( message )
    }

    // check if email is already invited
    let existingInvite = await module.exports.getInviteByEmail( { email } )
    if ( existingInvite ) throw new Error( 'Already invited!' )

    let inviter = await getUserById( { userId: inviterId } )
    let invite = {
      id: crs( { length:20 } ),
      email,
      inviterId: inviterId,
      message,
      resourceTarget,
      resourceId,
      role
    }

    await Invites().insert( invite )

    let serverInfo = await getServerInfo()
    let inviteLink = new URL( `/authn/register?inviteId=${invite.id}`, process.env.CANONICAL_URL )

    let emailText, emailHtml, subject

    emailText = `
Hello!

${inviter.name} has just sent you this invitation to join the ${serverInfo.name} Speckle Server (${process.env.CANONICAL_URL})! To accept their invitation, just click on the following link:

${inviteLink}
${message ? inviter.name + ' said: "' + message + '"' : ''}

Warm regards,
Speckle
---
This email was sent from ${serverInfo.name} at ${process.env.CANONICAL_URL}, deployed and managed by ${serverInfo.company}. Your admin contact is ${serverInfo.adminContact ? serverInfo.adminContact : '[not provided]'}.
      `

    emailHtml = `
Hello!
<br>
<br>
${inviter.name} has just sent you this invitation to join the ${serverInfo.name} Speckle Server!
To accept the invitation, <a href="${inviteLink}" rel="notrack">click here</a>!

<br>
<br>
${message ? 'They said: "' + message + '"<br><br>': ''}

Warm regards,
<br>
Speckle (on behalf of ${inviter.name})
<br>
<br>
<img src="https://speckle.systems/content/images/2021/02/logo_big-1.png" style="width:30px; height:30px;">
<br>
<br>
<caption style="size:8px; color:#7F7F7F; width:400px; text-align: left;">
This email was sent from ${serverInfo.name} at ${process.env.CANONICAL_URL}, deployed and managed by ${serverInfo.company}. Your admin contact is ${serverInfo.adminContact ? serverInfo.adminContact : '[not provided]'}.
</caption>
`

    if ( !resourceId ) {
      subject = 'Speckle Invitation from ' + inviter.name
    } else if ( resourceTarget === 'streams' ) {
      subject = `${inviter.name} wants to share a stream on Speckle with you!`
    }

    await sendEmail( { to: email, subject: subject, text: emailText, html: emailHtml } )

    return invite.id
  },

  async getInviteById( { id } ) {
    return await Invites().where( { id } ).select( '*' ).first()
  },

  async getInviteByEmail( { email } ) {
    return await Invites().where( { email: email.toLowerCase() } ).select( '*' ).first()
  },

  async validateInvite( { email, id } ) {
    const invite = await module.exports.getInviteById( { id } )
    return invite && invite.email === email.toLowerCase() && !invite.used
  },

  async useInvite( { id, email } ) {
    // TODO
    // send email to inviter that their invite was accepted?

    let invite = await module.exports.getInviteById( { id } )
    if ( !invite ) throw new Error( 'Invite not found' )
    if ( invite.used ) throw new Error( 'Invite has been used' )
    if ( invite.email !== email.toLowerCase() ) throw new Error( 'Invite email mismatch. Please use the original email the invite was sent to register.' )

    if ( invite.resourceId && invite.resourceTarget && invite.role ) {
      let user = await getUserByEmail( { email: invite.email } )
      if ( !user ) throw new Error( 'Failed to find new user. Did they register already?' )
      switch ( invite.resourceTarget ) {
      case 'streams':
        await grantPermissionsStream( { streamId: invite.resourceId, role: invite.role, userId: user.id } )
        break
      default:
        throw new Error( 'Failed to use invite. Unknown resource type.' )
      }
    }

    await Invites().where( { id: id } ).update( { used: true } )
    return true
  },

  sanitizeMessage( message ) {
    return sanitizeHtml( message, {
      allowedTags: [ 'b', 'i', 'em', 'strong' ],
    } )
  }
}
