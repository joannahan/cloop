# Cloop

http://squadjs-cloop.herokuapp.com/

Cloop is a web app that enables MIT students to find and communicate with other students in their classes. It features separate pages for each class, as well as a post and comment system that allows for quick, easy discussion.

## Usage

After you register for an account with your @mit.edu email address, you may join classes and post or comment. Users cannot register without an @mit.edu email address. Users also need to verify their account, and will receive an email with a confirmation code upon registration. Once logged in, users are led to the /group page which is their main user page. Here, users are able to see which classes they are currently enrolled in, which classes they have taken, and other classes that they are not currently taking or have taken. Users are also able to search for classes from the "Other Classes" list and can add classes to their "Enrolled Classes" list. Once done with a class, users can move their classes from the "Enrolled Classes" list to the "Taken Classes" list. Users can also delete classes they are currently taking. 

Users can visit a class page that they are currently taking. On the class page, they can post text as well as PDFs. Users are able to write posts and comment on their own or others' posts. Users can view PDF attachments within the post itself(embedded) or in an external dropbox link. Users can edit their own posts and comments, as well as delete their own posts and comments. Users can also upvote their own posts as well as flag their own posts if they enjoy self-deprecating humor. Other users can upvote other users' posts as well as flag them. The number of flags on posts/comments are not publicly displayed, but the number of upvotes are publicly displayed. The class page also displays the current students enrolled in the class. 


## Lead Authors

- app.js: Joanna

models:
- class.js: Joanna
- comment.js: Manuel
- post.js: Manuel
- user.js: Joanna

public/javascript:
- user_page.js: Joanna
- class_page.js: Manuel
- trie_controller.js: Ming
- trie_main.js: Ming
- trie.js: Ming

public/stylesheets:
- style.css: Ming

routes:
- comment.js: Danny
- group.js: Joanna
- index.js: Joanna
- post.js: Danny
- users.js: Joanna

secret:
- secret.js: Danny

tests:
- test.js: Ming

util:
- coursePersist.js: Joanna

views:
- layouts/layout.hbs: Joanna
- 404.hbs: Danny
- archived_class_page.hbs: Joanna
- class_page.hbs: Ming
- error.hbs: Danny
- login.hbs: Joanna
- register.hbs: Joanna
- upload.hbs: Danny
- user_page.hbs: Ming
- verification.hbs: Danny


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


##Importing Classes from the MIT coursesv2 API

1) Register with admin credentials (2 usernames with admin capabilities: admin, admin2) . Login with admin credentials.


2) Click the Download Courses button on the group page. This will import all the json files for the 2016FA semester into the seeds directory.


3) Click the Import/Update Courses button on the group page. This will consolidate all the downloaded json files into one compact json file of Mongoose objects. It will also automatically import the classes into the platform. 


4) Refresh the page to see the full list of imported classes on the group page.


