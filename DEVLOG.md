# Adding a Devlog Post

Devlog posts live in [`devlog/posts.js`](devlog/posts.js) as plain JS objects. There's
no server, database, or login. Publishing a post just means editing that file and
pushing to GitHub. Since only you have push access to this repo, that's the entire
access control needed, nobody else can add or edit a post.

## Steps

1. Open `devlog/posts.js`.
2. Copy one of the existing objects in the `DEVLOG_POSTS` array.
3. Fill in the fields:
   - `slug`: unique, lowercase, hyphenated (e.g. `"new-combat-trailer"`). Used in the post URL: `devlog.html#new-combat-trailer`.
   - `date`: `"YYYY-MM-DD"`. Posts always sort newest-first automatically.
   - `tags`: array of short labels (e.g. `["Art", "Combat"]`). These become filter pills on the devlog page.
   - `cover`: optional image path relative to the site root (e.g. `"combat3.png"`). Leave it out for a text-only post.
   - `excerpt`: one or two sentences shown in the list view and the homepage teaser.
   - `body`: the full post, written as plain HTML (`<p>`, `<h3>`, `<img>`, `<ul>`, etc).
4. Save, commit, and push. That's it, both the homepage "Chronicle" teaser and the full `/devlog.html` page pick it up automatically.

## Editing or removing a post

Find its object in the array, edit the fields (or delete the whole object), commit, push.
