
var taskListHours = { hackreactorinterview:5, 
  EC2instanceDeploy:3, 
  gym:4, 
  sideproject:7};



var addNewTaskCounter = 0;
var addNewTask = function() {
  if(addNewTaskCounter === 0) {
    resetTask();
    addNewTaskCounter = 1;
  }

  var task_name = prompt("Enter what Task name");
  var task_hours = prompt("Enter the approx hours for doing " + task_name);
  taskListHours[task_name] = Number(task_hours);
  //console.log(typeof taskListHours[task_name] === "number");
  

}

var resetTask = function() {

  taskListHours = {};

}


var isEmpty = function (obj) {
  return Object.keys(obj).length === 0;
}


/* Helper functions.  */

var printObj = function (obj1) {
  console.log("*******************");
  if(Array.isArray(obj1)) {
    console.log(obj1);
  } else if (typeof obj1 === "object") {
    for(var x in obj1) {
      console.log("Task: " + x + " hours:" + obj1[x]);
    }
  } else {
    console.log(obj1);
  }

}



var each = function(collection, callback){
//
if(Array.isArray(collection)) {
  for(var i = 0; i < collection.length; i++) {
    callback(collection[i]);
  }
} else if(typeof collection === "object") {
  for(var j in collection) {
    callback(collection[j]);
  }
} else {
  console.log("Debug error");
}
};

var reduce = function(collection, accumulator, callback){
  if(!typeof callback === "function")
    return "Error";

  each(collection, function(var1) {
    accumulator = callback(accumulator, var1);
  })
  return accumulator;
}

var map = function(collection, callback) {

  var outputArr = [];
  each(collection, function(var1){
    outputArr.push(callback(var1));

  });
  return outputArr;

}

var filter = function(collection, callback) {

  var output_arr = [];
  each(collection, function(var1) {
    if(callback(var1))
      output_arr.push(var1);
  });
  return output_arr;
}

var flatten = function(collection) {
  var output = [];

  output = reduce(collection, output, function(accumulator, var1) {

    if(Array.isArray(var1)){
      return accumulator.concat(flatten(var1));
    }else{
      return accumulator.concat(var1);
    }
  });

  return output;
  
}



var myFunction = function() {

  var  text;


    // Get the value of the input field with id="numb"
    var totalEnteredTime = parseInt(document.getElementById("tottime").value);
    totalEnteredTime = Number(totalEnteredTime);

    text = "You entered tasks:: ";
    var taskListPrint = "";

    for(var j in taskListHours) {
      taskListPrint += " " + j + "-" + taskListHours[j] + " hours,";
    } 

    text = text + taskListPrint;
    document.getElementById("displayds").innerHTML = text;

  //printObj(taskListHours);
  /******************************************************************/
  //We will find the total time for all the tasks for the object created and
  //then we will alert the user to either re-plan if total commitment is less

  var taskTotalHours = reduce(taskListHours, 0, function(accumulator, var1) {
    return accumulator + var1;
  });

  var totTimeText = "";
  if(taskTotalHours > totalEnteredTime) {
    totTimeText = "Please re-plan, Total commitment time is less than required: ";
  } else {
    totTimeText = "Good planning, the tasks can be done in total commitment time: ";
  }
  totTimeText += " TaskTotalHours = " + taskTotalHours;
  totTimeText += " Entered total commitment = " + totalEnteredTime;


  document.getElementById("parsedenter").innerHTML = totTimeText;

  /******************************************************************/
  // We are doing a 30 percent tarnsformation, so that the total time 
  //Effort increase by 30 % for each tasks
  //console.log(taskTotalHours);

  var taskTotalTransformHours = taskTotalHours + taskTotalHours * 0.30;
  //console.log(taskTotalTransformHours);

  //Transform the  taskListHours to reflect 30 percent more effort

  var item_count = 0;
  for(var i in taskListHours) {
    item_count++;
  }

  var transform_factor = (taskTotalTransformHours - taskTotalHours)/item_count;
    //printObj(transform_factor);


    var trasformed_taskListHours = map(taskListHours, function(var1) {
      return var1 + transform_factor;
    });

  //Forming the new object with the 30 % transformed result obtained from Map
  printObj(trasformed_taskListHours);
  var trasformed_taskList = {};
  var tr_i = 0;
  for(var y in taskListHours) {
    trasformed_taskList[y] = trasformed_taskListHours[tr_i];
    tr_i++;
  }
  printObj(trasformed_taskList); //Use this map

  var transformed30 = "IF you increase the efforts by 30 % which is statistically considered sum-optimal increased efficiency (Br theorem), then the below reflects the new time allotment for this increased level of transformation:                ";
  
  var taskListPrint = "";
  for(var m in trasformed_taskList) {
    taskListPrint += " " + m + "-" + trasformed_taskList[m] + " hours,";
  } 

  transformed30 = transformed30 + taskListPrint;

  document.getElementById("parsedresult").innerHTML = transformed30;   

  /******************************************************************/  
// We want to filter all those tasks which are statistically greater than median, 
//these will be returned to the user as more likely to prioritize for completetion 
var median_time = taskTotalHours / item_count;
  //console.log("Median time: " + median_time);

  //Filter tasks which are greater than median time

  var tasksListMoreThanMedian = filter(taskListHours, function(var1) {
    return ( var1 > median_time);
  });
  printObj(tasksListMoreThanMedian);

  //Forming the filtered List object obtained by filtering
  var filtered_taskList = {};
  for (var rd_i = 0; rd_i < tasksListMoreThanMedian.length; rd_i++) {
    var test = tasksListMoreThanMedian[rd_i];
    for(var b in taskListHours) {
      if(test === taskListHours[b]) {
        filtered_taskList[b] = test;
      }
    }
  }

  printObj(filtered_taskList); //Use this filter
  var filteredtext = "These tasks require your attention; they are more than the median-time and have statistically more risks to non-completition. Please check these tasks again. Here are those tasks:           ";
  
  var taskListPrint = "";
  for(var l in filtered_taskList) {
    taskListPrint += " " + l + "-" + filtered_taskList[l] + " hours,";
  } 

  filteredtext = filteredtext + taskListPrint;

  document.getElementById("parsedreduce").innerHTML = filteredtext;   

  /******************************************************************/  


//Statistically we are trying to find the total cumulative hours increase if 
//we were to increase efforts by 1 unit , 2 unit , 3 unit increase
// respictively on each of the fields

var efforts_hours_list = [];
var add_hour_one = map(taskListHours, function(var1) {
  return 1 + var1;
});
var add_hour_two = map(taskListHours, function(var1) {
  return 2 + var1;
});
var add_hour_three = map(taskListHours, function(var1) {
  return 3 + var1;
});
efforts_hours_list.push(add_hour_one);
efforts_hours_list.push(add_hour_two);
efforts_hours_list.push(add_hour_three);

efforts_hours_list = flatten(efforts_hours_list);

console.log(efforts_hours_list);


var cumulative_average123 = reduce(efforts_hours_list, 0, 
  function(accumulator, var1) {
    return accumulator + var1;
  }) / 3;

console.log(cumulative_average123);    //Use this flatten  
var cumulative_text = "The cumulative hours increase for 1/2/3 units average increased efforts is :  ";
cumulative_text += cumulative_average123 + " hours. Please put these increased hours to improve your chances statistically for completetion of all tasks";

document.getElementById("parsedcumulative").innerHTML = cumulative_text;  



}


