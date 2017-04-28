/* This code is based off code by Atul Bhats, you can see the original at http://atulbhats.com/terminal */
/* However there are a lot of changes and cleanups to make this work with wordpress with dynamic commands */
/* Allowing you to hopefully use Wordpress as you feel like it and this should dynamically work with it */
/* TODO: Remove all traces of JQuery as it'd be one less dependency */
/* TODO: Theming? */
/* TODO: Setup posts to be a directory */
/* Maybe make this DOS themed? */

var $history = new Array();

var $commands = [
  {cmd: 'help',   hidden: false,    clear: false,   type: 'function',   output: show_available_commands},
  {cmd: 'cls',    hidden: false,    clear: true,    type: 'print',      output: ''},
  {cmd: 'dir',    hidden: false,    clear: false,   type: 'print',      output: ''},
  {cmd: 'date',   hidden: false,    clear: false,   type: 'print',      output: ''},
  {cmd: 'type',   hidden: false,    clear: false,   type: 'print',      output: ''},
  {cmd: 'xyzzy',  hidden: true,     clear: false,   type: 'print',      output: 'Nothing happens'}
];

function hidedefault() {
  $('#defaultline').hide();
}

function showdefault() {
  $('#defaultline').show();
}

function find_tab_completed_command(command) {
  if (!command)
    return command;

  // var commands = ['help', 'cls', 'dir', 'date', 'more', 'type'];
  // for (var i = 0; i < pages.length; i ++) {
  //   var page = pages[i];
  //   commands.push(page.command);
  // }

  /* Loop through the list of commands and find if there is enough information for a single match */
  var results = [];
  for (var i = 0; i < $commands.length; i ++) {
    cmd = $commands[i];
    if (cmd.cmd.startsWith(command) && cmd.hidden == false) {
      results.push(cmd.cmd);
    }
  }

  if (results.length == 1) {
    /* One result, lets use it */
    console.log("Found tab result: " + results[0]);
    return results[0];
  }

  console.log("Too many matching results or no results found");
  if (results.length > 0) {
    var response = "print:" + command + ":" + results.join(':');
    runcommand(response);
  }

  return command;
}

function show_available_commands(parameters) {
  var commands="<div class='help'>"+
      "<div>Interface Commands</div>"+
      "<div><b>help</b>Lists all available commands</div>"+
      "<div><b>clear</b>Clear the screen</div>"+
      "<div><b>reboot</b>Reboot this system</div>";
  for (var i = 0; i < pages.length; i ++) {
    var page = pages[i];
    commands += "<div><b>" + page.command + "</b>" + page.title + "</div>";
  }
  commands +="</div>";
  return commands;
}

function outputText(outputText) {
  $('#defaultline').before('<div class="line" id="line'+$l+'"></div>');
  $('#line'+$l).html(outputText);
  $('#commandcontainer').text("");
  $('#actualinput').val("");
  $l++;
  if($clr==1){
    $l=0;
    $('.line').remove();
    $('.commandline').remove();
    $clr=0;
  }
  $('#actualinput').focus();
  $(document).scrollTop($(document).height());
}

function runcommand($command) {
  unnull();
  $command = $command.toLowerCase();

  // var extras = '';
  // if ($command.startsWith("print")) {
  //   var results = $command.split(':');
  //   $command = "print";
  //   $command2 = results[1];
  //   for (var i = 2; i < results.length; i ++) {
  //     extras +=  results[i] + "&#09;";
  //   }
  // }
  // else {
  $command2=$command;
  rehistory($command);
  $history[$z]=$command;
  $z++;
  $x=$z;
  // }
  $('#defaultline').before('<div class="commandline" id="commandline'+$l+'"><span class="defaulttext">C:\\> </span>'+$command2+'</div>');

  var given_commands = $command.split(" ");
  var command = given_commands[0];
  var parameters = [];
  if (given_commands.length > 1) {
    parameters = given_commands.slice(1, given_commands.length);
  }

  var found_command = false;

  for (var i = 0; i < $commands.length; i ++) {
    cmd = $commands[i];
    if (cmd.cmd == command) {
      found_command = true;
      // Found a matching command, lets action it.
      if (cmd.type == 'function') {
        var fn = cmd.output;
        $html = fn(parameters);
      } else if (cmd.type == 'print') {
        $html = cmd.output;
      }

      $clr = 0;
      if (cmd.clear) {
        $clr = 1;
      }
    }
  }

  if (!found_command) {
    $html="\'"+$command+"\' Is not a known Command. But that might change the next time you are here. Use '<b>help</b>' for the list of available commands";
  }

  // switch($command){
  //   case 'help':
  //   $html=show_available_commands();
  //   break;

  //   case 'xyzzy':
  //   $html="Nothing happens";
  //   break;

  //   case 'clear':
  //   $clr=1;
  //   $html="";
  //   break;

  //   case '':
  //   $html="";
  //   break;

  //   case 'print':
  //   $html = extras;
  //   break;

  //   case 'reboot':
  //   $html="The system is going down for reboot NOW!<script>location.reload();</script>";
  //   break;

  //   default :
  //   $html="\'"+$command+"\' Is not a known Command. But that might change the next time you are here. Use '<b>help</b>' for the list of available commands";
  //   for (var i = 0; i < pages.length; i ++) {
  //     var page = pages[i];
  //     if ($command == page.command) {
  //       $html = page.page;
  //       break;
  //     }
  //   }
  // }

  outputText($html);
}

function unnull(){
  for($i=0;$i<$history.length;$i++){
    if($history[$i]=="" || $history[$i]==null || $history[$i]==undefined ){
      for($j=$i;$j<$history.length;$j++){
        $history[$j]=$history[$j+1];
      }
      $z--;
    }
  }
  $z=$history.length;
}

function rehistory($cmd){
  if($history.indexOf($cmd)>=0){
    for($i=$history.indexOf($cmd);$i<$history.length;$i++){
      $history[$i]=$history[$i+1];
    }
    $z--;
  }
} 


$(document).ready(function() {

  $('#introdiv').html('');

  $z=0;
  $x=0;
  $('#actualinput').focus();
  hidedefault();
  $('.cursor').css('background','rgb(238, 238, 238)');  
  $link="";
  $sendact=0;
  $clr=0;
  $save=0;

  $('#introdiv').html(frontpage + "<br />Start with <b>help</b> to learn the commands.");
  showdefault();

  setInterval(function(){
          blinkcursor();
        },560);

  function blinkcursor(){
    $bg=$('.cursor').css('background-color');
    if($bg=='rgb(238, 238, 238)'){
      
      $('.cursor').css('background-color','transparent'); 
    }
    else $('.cursor').css('background-color','rgb(238, 238, 238)');
  }

  $l=0;  

  $(document).bind('keyup', function(e) {
    $existing=$('#commandcontainer').text();

    if(e.which==38){
      if($x>0){
        $('#actualinput').val($history[$x-1]);
        $('#commandcontainer').text($history[$x-1]);
        $x--;
        if($x<0)
          $x=0; 
      }
      if($x<0){
        return false;
      }
      
    }
    else if(e.which==40){
      if($x>=0){
        $('#commandcontainer').text($history[$x+1]);
        $('#actualinput').val($history[$x+1]);
        $x++;
      }
      if($x>$z){
        return false;
      }
    }
    if(e.which==13){
      runcommand($existing);
      $('#actualinput').focus();
    }
    else{
      $type=true;
    }
  });

  $(document).bind('keydown', function(e) {
    var existing = $('#commandcontainer').text();
    var code = e.keyCode || e.which;
    if (code == '9') {
      var results = find_tab_completed_command(existing);
      $('#actualinput').val(results);
      return false;
    }
  });

  $('#actualinput').keyup(function(e){
    if(e.which==8){
        $exist=$('#commandcontainer').text();
        /*delete pressed */
        e.preventDefault();
        /*alert('del');*/
        $c=$exist.length-1;
        $('#commandcontainer').text($exist.slice(0,$c));
    }
      else{
        /*alert("pressed : "+e.which);*/
      $('#commandcontainer').text($(this).val());
    }
  });

  $('body').click(function(){
    $('body').scrollTop($(window).height());
  });

  $(document).on("tap", function(e) {
    $('#actualinput').focus();
  });

  $(document).keydown(function(e) {
    $('#actualinput').focus();
  });  
});