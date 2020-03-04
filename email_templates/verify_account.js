const verify_account = data => {
    return `
    <!DOCTYPE html>
    <html style="margin: 0; padding: 0;">

        <head>
            <title>Please Verify your account</title>
        </head>

        <body style="margin: 0; padding: 0;">
            <br/>
            <br/>
            <div>Click in the follow link to verify your account</div>
            <a href="${data.name}">${data.name}</a>
            <br/>
            <br/>
        </body>
    </html>`
    ;
};

module.exports = {verify_account}; 