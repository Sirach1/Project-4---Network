document.addEventListener('DOMContentLoaded', () => {
    const submit_btn = document.querySelector('#post-submit');
    if (submit_btn) {
        submit_btn.addEventListener('click', create_post);
    }
    
    document.addEventListener('click', (event) => {
        const element = event.target;
        let svg_class = element.className.baseVal;
        console.log(svg_class);
        // like/unlike
        if (svg_class === 'like' || svg_class === 'unlike') {
            fetch('/like_post', {
                method: 'POST',
                body: JSON.stringify({
                    post_id: element.closest('.card').dataset.post_id
                })
            }).then(response => response.json()).then(data => {
                if (data.error) {
                    console.log(data);
                } else {
                    const post_body = element.closest('.card-body');
                    const like_count = post_body.querySelector('.like_count');
                    console.log(like_count);
                    if (svg_class === 'like') {
                        like_count.innerText = Number(like_count.innerText) + 1;
                        svg_class = 'unlike';
                        element.className.baseVal = 'unlike';
                        element.className.animVal = 'unlike';
                    } else {
                        like_count.innerText = Number(like_count.innerText) - 1;
                        element.className.baseVal = 'like';
                        element.className.animVal = 'like';
                    }
                }
            });
        }
    });

    const follow_btn = document.querySelector('follow-btn');
    if (follow_btn) {
        follow_btn.addEventListener('click', () => {
            fetch();
        });
    }
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
                        class="like" viewBox="0 0 16 16">
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

