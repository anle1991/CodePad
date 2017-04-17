var express = require('express');
var router = express.Router();

router.get('/createTask', function(req,res){
  var newTask = new Task();

  newTask.save(function(err,data){
    if(err){
      console.log("Error save task: " + err);
      res.render('error');
    }else{
      res.redirect('/task/' + data._id);
    }
  })
});

router.get('/task/:id', function(req, res){
  if(req.params.id){
    console.log("Task ID: " + req.params.id);
    Task.findOne({_id: req.params.id}, function(err,data){
      if(err){
        console.log("Error find task: " + err);
        res.render('error');
      }

      if(data){
        res.render('task', {data: data, roomId: data.id});
      }else{
        console.log("Error data: " + err + " - " + data);
        res.render('error');
      }
    })
  }else{
    res.render('error');
  }
});

module.exports = router;