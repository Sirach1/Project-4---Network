document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (event) => {
        const element = event.target.closest('path.like, path.unlike');
        if (!element) return;
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

    const follow_btn = document.querySelector('#follow-btn');
    if (follow_btn) {
        const user_profile = follow_btn.closest('#profile-view');
        follow_btn.addEventListener('click', () => {
            fetch('/following', {
                method: 'POST',
                body: JSON.stringify({
                    user_profile: user_profile.id
                })
            });
        });
    }
});

