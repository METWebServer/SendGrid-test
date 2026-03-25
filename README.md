# SendGrid-test
To test SendGrid functionality for Service Accounts

Due to Microsoft's SMTP Deprecation, there are tools like SendGrid or smtp2go that serve as the App that handles the authentication, whilst using a mailbox tied to the app (e.g. SendGrid) to send the email.
These apps can generate a username and password that work almost exactly like SMTP username/password, except that it handles this request similar to an ACS resource.

To use this repo, all you have to do is add the credentials to the .env, as well as the mailbox where the email is coming from and the MAIL_TO.

Then run it with 'npm start' and watch the email being sent, along with the debug.
