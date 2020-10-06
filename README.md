# cloudflare-worker

## This worker does the following

Check if the cookies name and quote are set on your Worker domain.

#### If they are set, respond with JavaScript code that does the following:

Log the two cookies to the browser console
Set the two cookies as first-party cookies using document.cookie, and prefix the cookie names with local_ (eg. name should be local_name).


#### If the cookies are not set, respond with JavaScript code that does the following:

Read the name and quote variables, and POST their values to your Worker.
Answer the POST Request with an HTTP Response that sets both variables as two separate cookies on your Worker domain, with the furthest possible expiry date. Also, print the visitor IP address to the browser console.
