document.addEventListener('DOMContentLoaded', () => {
    const submit_btn = document.querySelector('#post-submit').addEventListener('click', create_post);
    document.addEventListener('click', (event) => {
        const element = event.target;
        if (element.className === 'heart') {
            console.log("click");
            fetch('/like_post', {
                method: 'POST',
                body: JSON.stringify({
                    post:element.closest('.card').dataset.post
                })
            }).then(response => response.json()).then(data => {
                console.log(data);
            });
        }
    });
});

function create_post() {
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

            const new_post = document.createElement('div');
            new_post.className = 'card';
            const post = data.post;
            new_post.innerHTML = `
                <div class="card-header" style="background-color: white;">
                    <h4>${post.user}</h4>
                </div>
                <div class="card-body">
                    <p class="card-text">${post.content}</p>
                    <p class="card-text">${post.timestamp}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" id="post-like"
                        class="heart" viewBox="0 0 16 16">
                        <path
                            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                    <p style="display: inline;">0</p>
                    <a href="#">Edit</a>
                </div>
                `;
            document.querySelector('#all_post').prepend(new_post);
        }
        console.log(data);
    })
}

