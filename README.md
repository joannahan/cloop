# Cloop

Cloop is a web app that enables MIT students to find and communicate with other students in their classes. It features separate pages for each class, as well as a post and comment system that allows for quick, easy discussion.

## Usage

After you register an account, you may join classes and post or comment.

## Lead Authors

Models:
- class.js: Danny
- comment.js: Manuel
- post.js: Manuel
- user.js: Joanna

Public/Javascript:
- ajax.js: Danny
- index.js: Joanna

Public/Stylesheets:
- style.css: Joanna

Routes:
- comment.js: Danny
- group.js: Danny
- index.js: Joanna
- Post.js: Danny
- Users.js: Joanna

Views:
- layout.hbs: Ming
- class_page.hbs: Ming
- comment.hbs: Ming
- login.hbs: Joanna
- post.hbs: Ming
- register.hbs: Joanna
- templates.js: Ming
- user_page.hbs: Ming

## MVP Features:

In the MVP, we have implemented:
- Login/Registration System
- Manually adding classes
- Joining existing classes
- Class pages
- Posting on class pages
- Commenting on posts
- Upvoting posts and comments
- Documentation of model methods
- Structure for handlebars templating

For the final product, we will:
- Add validation for MIT emails
- Add other validators, such as not allowing multiple classes with the same name
- Deal with security concerns
- Write tests 
- Add flagging for posts and comments
- Add autocomplete/search for class pages
- Add frontend to make our app look presentable
- Allow users to upload resources in their posts
- Incorporate other feedback from our MVP