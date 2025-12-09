document.addEventListener('DOMContentLoaded', () => {
    const submit_btn = document.querySelector('#post-submit').addEventListener('click', () => {
        fetch('/create_post', {
            method: 'POST',
            body: JSON.stringify({
                content: document.querySelector('#post-content').value
            })
        }).then(response => response.json()).then(data => {
            if (data.error) {
                document.querySelector("#error").textContent = data.error;
                document.querySelector("#success").textContent = "";
            } else {
                document.querySelector("#error").textContent = "";
                document.querySelector("#success").textContent = data.message;
            }
            console.log(data);
        })
    });
});