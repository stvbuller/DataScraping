$(document).ready(function() {

$("#scrapedData").click(function(e){
    $.getJSON("/scrape", function() {
      $("tbody").empty();
    });

    $.getJSON("/getItems", function(response) {
      $("tbody").empty();
      response.forEach(function(scrapedData) {
        var newTr = "<tr>";
        newTr += "<td>" + scrapedData.title + "</td>";
        newTr += "<td>" + scrapedData.link + "</td>";
        newTr += "</tr>";
        $("tbody").append(newTr);
        var newButton1 = "<button type='button' name='button' id='submitItem'>Submit</button>";
        $("tbody").append(newButton1);
        var newButton2 = "<button type='button' name='button' id='deleteItem'>Delete</button>";
        $("tbody").append(newButton2);

      });
    });

  });

$("#getItems").click(function(e){
    $.getJSON("/getItems", function(response) {
      $("tbody").empty();
      response.forEach(function(scrapedData) {
        var newTr = "<tr>";
        newTr += "<td>" + scrapedData.title + "</td>";
        newTr += "<td>" + scrapedData.link + "</td>";
        newTr += "</tr>";
        $("tbody").append(newTr);
        var newButton1 = "<button type='button' name='button' id='submitItem'>Submit</button>";
        $("tbody").append(newButton1);
        var newButton2 = "<button type='button' name='button' id='deleteItem'>Delete</button>";
        $("tbody").append(newButton2);

      });
    });
  });

$("#deleteAll").click(function(e){
    $.getJSON("/deleteAll", function() {
      $("tbody").empty();
    });
  });

$("#deleteItem").click(function(e){
    $.getJSON("/delete/:id", function(response) {
      $("tbody").empty();
      // response.forEach(function(scrapedData) {
      //   var newTr = "<tr>";
      //   newTr += "<td>" + scrapedData.title + "</td>";
      //   newTr += "<td>" + scrapedData.link + "</td>";
      //   newTr += "</tr>";
      //   $("tbody").append(newTr);
      //   var newTr2 = "<button type='button' name='button' id='submitItem'>Submit</button>";
      //   $("tbody").append(newTr2);
      //   var newTr3 = "<button type='button' name='button' id='deleteItem'>Delete</button>";
      //   $("tbody").append(newTr3);

      // });
    });
  });


  // $("#nameButton").click(function(e) {
  //   alert("Clicked name!")
  // });

}); //end of document.ready