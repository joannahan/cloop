# Cloop

http://squadjs-cloop.herokuapp.com/

Cloop is a web app that enables MIT students to find and communicate with other students in their classes. It features separate pages for each class, as well as a post and comment system that allows for quick, easy discussion.

## Usage

After you register an account, you may join classes and post or comment.

## Lead Authors

- app.js: Joanna

Models:
- class.js: Danny/Joanna
- comment.js: Manuel
- post.js: Manuel
- user.js: Joanna

Public/Javascript:
- user_page.js: Joanna
- class_page.js: Manuel
- trie_controller.js: Ming
- trie_main.js: Ming
- trie.js: Ming
- coursePersist.js: Joanna

Public/Stylesheets:
- style.css: Ming

Routes:
- comment.js: Danny
- group.js: Danny/Joanna
- index.js: Joanna
- Post.js: Danny
- Users.js: Joanna

Views:
- layouts/layout.hbs: Joanna
- class_page.hbs: Ming
- login.hbs: Joanna
- register.hbs: Joanna
- user_page.hbs: Ming
- archived_class_page.hbs: Joanna
- verification.hbs: Ming
- upload.hbs: Danny

Secret:
- secret.js: Danny

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


## Backup/Restore and Importing Classes from the API (UPDATED NEW VERSION)

1) Login with admin credentials.


2) Click the Download Courses button on the group page. This will import all the json files for the 2016FA semester into the seeds directory.


3) Click the Import/Update Courses button on the group page. This will consolidate all the downloaded json files into one compact json file of Mongoose objects. It will also automatically import the classes into the platform. 


4) Refresh the page to see the full list of imported classes on the group page.



## Backup/Restore and Importing Classes from the API (OLD VERSION)
(To provide backup of all the collections, we will be utilizing mongodump and mongorestore if necessary.)


Only admins of the cloop webapp can import courses to the platform. Admins have access to the Create Class, Download Courses, and Package Courses buttons on the group page. To make a registered user an admin, run:

```
db.users.update({"name":"a"},{$set:{"admin":"true"}})
```


If you want to import classes from the API by yourself....
Steps for importing classes from the MIT coursesv2 API onto the platform:


1) Click the Download Courses button on the group page. This will import all the json files for the 2016FA semester into the seeds directory.


2) Click the Package Courses button on the group page. This will consolidate all the downloaded json files into one compact json file of Mongoose objects.


3) cd to the /bin folder of where you have mongo installed. (eg. mine is /Users/Joanna/Downloads/mongodb-osx-x86_64-3.2.11/bin)


4) run ./mongodump 
This will generate a dump of the state of all your current databases so you won't lose your database information. 

5) Run this command for renaming the dump file (optional):

```
mv dump newFileNameForTheDump
```

6) Make a copy of the courses_data.json file in the bin folder as well by running:

```
cp /Users/Joanna/Desktop/6.170/FinalProject/cloop/seeds/courses_data.json .
```

7) Import the courses_data file as a collection into the existing cloop database by running:

```
./mongoimport --db cloop --collection classes < ./courses_data.json
```

Now you should see a collection called 'classes' in the cloop database with all the classes from 2016FA in it. If you refresh your localhost, you can see a list of all the classes appear on the group page.


Alternatively, you can just copy the courses_data.json file I pushed into your bin folder (step 6) and then follow the steps afterwards to import it into the platform. 


If you want to try out the whole process, pls don't push all the seeds/courses_*.json files that are generated since you really only need the courses_data.json file.
