document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (event) => {
        const svg = event.target.closest('path.like, path.unlike');
        const edit = event.target.closest('.edit');
        const save_post = event.target.closest('#post-save');
        if (svg) {
            const svg_class = svg.className.baseVal;
            // like/unlike
            if (svg_class === 'like' || svg_class === 'unlike') {
                fetch('/like_post', {
                    method: 'POST',
                    body: JSON.stringify({
                        post_id: svg.closest('.card').dataset.post_id
                    })
                }).then(response => response.json()).then(data => {
                    if (data.error) return console.log(data);

                    const post_body = svg.closest('.card-body');
                    const like_count = post_body.querySelector('.like_count');

                    like_count.textContent = Number(like_count.textContent) + (svg_class === "unlike" ? -1 : 1);
                    svg.classList.toggle('unlike');
                    svg.classList.toggle('like');


                }).catch(error => console.error("Fetch error:", error));
            }
        } else if (edit) {
            event.preventDefault();
            const card = edit.closest('.card');
            const post = edit.closest('.card-body');
            card.querySelector('.content').style.display = 'none';
            const post_id = card.dataset.post_id;
            const content = post.dataset.content;
            const form = document.createElement('div');
            form.className = 'update-form';
            form.innerHTML = `
                <textarea class="form-control update-content" placeholder="Write something."
                    style="height: 100px">${content}</textarea>
                <button type="button" id="post-save" class="btn btn-primary btn-sm mt-2">save</button>          
            `;
            post.prepend(form);
        } else if (save_post) {
            const card = save_post.closest('.card');
            const post_id = card.dataset.post_id;
            const new_content = card.querySelector('.update-content').value;
            fetch('/update_post', {
                method: 'POST',
                body: JSON.stringify({
                    post_id: post_id,
                    content: new_content
                })
            }).then(response => response.json()).then(data => {
                if (data.error) return;
                const content_p = card.querySelector('.content');
                content_p.textContent = new_content;
                content_p.style.display = 'block';
                card.querySelector('.update-form').remove();
            }).catch(error => console.error("Fetch error: ", error));

        }


    });

    const follow_btn = document.querySelector('.follow-btn');
    if (follow_btn) {
        const user_profile = follow_btn.closest('#profile-view').dataset.user_profile;
        follow_btn.addEventListener('click', () => {
            fetch('/following', {
                method: 'POST',
                body: JSON.stringify({
                    userProfile: user_profile
                })
            }).then(response => response.json()).then(data => {
                if (data.error) return;

                const follower = document.querySelector('#follower_count');

                follow_btn.classList.toggle('btn-primary');
                follow_btn.classList.toggle('btn-outline-primary');
                follow_btn.textContent = data.followed ? "Unfollow" : "Follow";
                follower.textContent = Number(follower.textContent) + (data.followed ? 1 : -1);
            }).catch(error =>
                console.error("Fetch error:", error)
            );
        });
    }
});

