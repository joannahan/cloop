var assert = require("assert");
var mongoose = require("mongoose");

var Class = require('../models/class');
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');

describe("Cloop", function() {

  var connection;

  before(function(done) {
    connection = mongoose.connect("mongodb://localhost/testdb", function() {
      done();
    });
  });

  //Class testing
  describe("Class", function(){
    //Instantiating
    it("shouldn't allow for duplicate class names", function(done) {
      Class.create({ name: "6.170 Software Studio"},
        function(err, data) {
          Class.create({"name": "6.170 Software Studio"},
            function(err, data) {
              assert.throws(function(){
                assert.ifError(err);
              });
            });
          done();
      });
    });

    it("shouldn't allow for empty name strings", function(done) {
      Class.create({ name: ""},
        function(err, data){
          assert.throws(function(){
            assert.ifError(err);
          });
          done();
        });
    });

    it("should initialize empty students and posts lists", function(done) {
      Class.create({ name: "hello"},
        function(err, data){
          Class.findOne({ name: "hello"}, function(err, data){
            assert.equal(data.name, "hello");
            assert.equal(data["students"].length, 0);
            assert.equal(data["posts"].length, 0);
          });
          done();
        });
    });

    //Adding, removing, checking
    it("should be able to add, retrieve(by name or id), and delete students", function(done){
      Class.create({ name: "test"},
        function(err, data){
          Class.findOne({name: "test"}, function(err1, data1){
            //create student
              User.create({ username: "person",
              name: "apple",
              email: "appel@mit.edu",
              password: "password" },
              function(err2, data2){
                //deleted function(err3, data3)
                User.findOne({ name: "apple"}, function(data3){
                      Class.addStudent(data1._id, data3._id, function(){
                        Class.getStudents(data1._id, function(students){
                        assert.equal(students.length, 1);
                        assert.equal(students[0].name, "apple");
                       });
                      });
                });
              });
          });
          done();
        });
    });

    //TODO
    it("should add, retrieve, and remove posts", function(done) {
      Class.create({ name: "test"},
        function(err, data){
          Class.findOne({name: "test"}, function(err, data){
            
          });
          done();
        });
    });

    it("should retrieve a list of all class names", function(done) {
      Class.create({ name: "test"},
        function(err, data){
          Class.create({ name: "test2"}, 
            function(err, data){
              Class.getAllClasses(function(classes){
                var names = classes.map(classes.name);
                assert.equal(classes.length, 2);
                assert.equal(names, ["test", "test2"] || ["test2", "test"]);
              });
            });
          done();
        });
    }); 

  });

  //User testing
  describe("User", function() {

    // it("should only allow for each username to be used once", function(done) {
    //   User.create({ username: "apple",
    //                 name: "appel",
    //                 email: "appel@mit.edu",
    //                 password: "password" },
    //       function(err, data) {
    //         User.create({ username: "apple",
    //                       name: "appel",
    //                       email: "appel@mit.edu",
    //                       password: "password" },
    //           function(err, data) {
    //             assert.throws(function() {
    //               assert.ifError(err);
    //             });
    //         });
    //         done();
    //       });
    // });

    it("should require username field to be filled out", function(done) {
      User.create({ username: "",
                    name: "appel",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            assert.throws(function() {
              assert.ifError(err);
            });
            done();
          })
    });

    it("should require password field to be filled out", function(done) {
      User.create({ username: "person",
                    name: "appel",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            assert.throws(function() {
              assert.ifError(err);
            });
            done();
          })
    });

    it("should require email field to be filled out", function(done) {
      User.create({ username: "person",
                    name: "appel",
                    email: "",
                    password: "password" },
          function(err, data) {
            assert.throws(function() {
              assert.ifError(err);
            });
            done();
          })
    });

    it("should require name field to be filled out", function(done) {
      User.create({ username: "person",
                    name: "",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            assert.throws(function() {
              assert.ifError(err);
            });
            done();
          })
    });

    it("should instantiate right fields", function(done) {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({ name: "apple" }, function(err, data) {
              assert.equal(data['admin'], false);
            });
            done();
          });
    });

    it("should update classes taken", function(done) {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({ name: "apple" }, function(err, data) {
              var uid = data._id;
              Class.create({ name: "6.170"}, function(err1, data1){
                User.addTakenClass(uid, data1._id, function(){
                  User.getClassesTakenByStudentId(uid, function(classlist){
                    assert.equal(data1.name, classlist[0].name);
                  });
                });
              });
            });
            done();
          });
    });

    it("should update classes enrolled", function() {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({ name: "apple" }, function(err, data) {
              var uid = data._id;
              Class.create({ name: "6.170"}, function(err1, data1){
                User.addEnrolledClass(uid, data1._id, function(){
                  User.getClassesEnrolledByStudentId(uid, function(classlist){
                    var contains = classlist.includes(String(data1._id));
                    assert.equal(contains, true);
                  });
                });
              });
            });
          });
    });

    it("should keep track of account verification", function() {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({ name: "apple" }, function(err, data) {
              assert.equal(data['verifiedEmail'], false);
            });
          });
    });

  });

  describe("Post", function() {

    it("should require text field to be filled out", function(done) {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "",
                author: data1._id
              },
            function(err, data) {
              assert.throws(function() {
                assert.ifError(err);
              });
            });
            done();
            });
          });
    });
    
    it("should not be affected by script injections", function(done) {
        User.create({ username: "person",
                      name: "apple",
                      email: "appel@mit.edu",
                      password: "password" },
            function(err, data) {
              User.findOne({name: "apple"}, function(err1, data1){
                Post.create({
                  text: "test<script>alert('Injected!');</script>",
                  author: data1._id
                },
              function(err, data) {
                assert.equal(data1["posts"][0], "test<script>alert('Injected!');</script>");
              });
              done();
              });
            });
      });
    
    it("should add, get, remove comments", function(done) {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "hello",
                author: data1._id
              },
              function(err2, data2){
                Post.findOne({text: "hello"}, function(err3, data3){
                  Comment.create({
                    text:"hello",
                    author: data1._id
                  },
                  function(err4, data4){
                    Comment.findOne({text: "hello"}, function(err5, data5){
                      Post.addComment(data3._id, data5._id, function(){
                        assert.equal(data3["comments"][0], data5_id);
                      });
                    });
                  });
                });
              });
            });
            done();
          });
    });

    it("should update upvotes and only allow one upvote per user", function() {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "hello",
                author: data1._id
              },
              function(err2, data2){
                Post.findOne({text: "hello"}, function(err3, data3){
                  Post.userToggleUpvote(data3._id, data1._id, function(){
                    assert.equal(data3["upvoteUsers"].length, 1);
                    Post.userToggleUpvote(data3._id, data1._id, function(){
                      assert.equal(data3["upvoteUsers"].length, 0);
                    });
                  });
                });
              });
            });
          });
    });

    it("should only allow one flag per user", function() {
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "hello",
                author: data1._id
              },
              function(err2, data2){
                Post.findOne({text: "hello"}, function(err3, data3){
                  Post.userFlag(data3._id, data1._id, function(){
                    assert.equal(data3["flagUsers"].length, 1);
                    Post.userFlag(data3._id, data1._id, function(){
                      assert.equal(data3["flagUsers"].length, 1);
                      Post.userUnflag(data3._id, data1._id, function(){
                        assert.equal(data3["flagUsers"].length, 0);
                      });
                    });
                  });
                });
              });
            });
          });
    });

  });

  describe("Comment", function() {
    //partially tested in Post
    it("should allow one upvote per user", function(){
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "hello",
                author: data1._id
              },
              function(err2, data2){
                Post.findOne({text: "hello"}, function(err3, data3){
                  Comment.create({
                    text:"hello",
                    author: data1._id
                  },
                  function(err4, data4){
                    Comment.findOne({text: "hello"}, function(err5, data5){
                      Post.addComment(data3._id, data5._id, function(){
                        Comment.userToggleUpvote(data5._id, data1._id, function(){
                          assert.equal(data5.upvoteUsers.length, 1);
                          Comment.userToggleUpvote(data5._id, data1._id, function(){
                            assert.equal(data5.upvoteUsers.length, 0);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
    });

    it("should only allow one flag per user", function(){
      User.create({ username: "person",
                    name: "apple",
                    email: "appel@mit.edu",
                    password: "password" },
          function(err, data) {
            User.findOne({name: "apple"}, function(err1, data1){
              Post.create({
                text: "hello",
                author: data1._id
              },
              function(err2, data2){
                Post.findOne({text: "hello"}, function(err3, data3){
                  Comment.create({
                    text:"hello",
                    author: data1._id
                  },
                  function(err4, data4){
                    Comment.findOne({text: "hello"}, function(err5, data5){
                      Post.addComment(data3._id, data5._id, function(){
                        Comment.userToggleFlag(data5._id, data1._id, function(){
                          assert.equal(data5.flagUsers.length, 1);
                          Comment.userToggleFlag(data5._id, data1._id, function(){
                            assert.equal(data5.flagUsers.length, 0);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
    });
  });
   

});