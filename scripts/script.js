function myFunction() {
  var x = document.getElementById("myTopNav");
  if (x.className === "upper-nav") {
      x.className += " responsive";
  } else {
      x.className = "upper-nav";
  }
}