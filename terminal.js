/* This code is based off code by Atul Bhats, you can see the original at http://atulbhats.com/terminal */
/* However there are a lot of changes and cleanups to make this work with wordpress with dynamic commands */
/* Allowing you to hopefully use Wordpress as you feel like it and this should dynamically work with it */
/* TODO: Remove all traces of JQuery as it'd be one less dependency */
/* TODO: Theming? */
/* TODO: Setup posts to be a directory */
/* Maybe make this DOS themed? */

function hidedefault(){
  $('#defaultline').hide();
}

$(document).ready(function(){

  $('#introdiv').html('');

  $z=0;
  $x=0;
  $('#actualinput').focus();
  $('#defaultline').hide();
  $('.cursor').css('background','rgb(238, 238, 238)');  
  $link="";
  $p=0; /*intro counter*/
  $msg=0;
  $msgcmd=0;
  $sendact=0;
  $clr=0;
  $save=0;
  /*
  # : br
  ^ : bold open
  %:  copyright
  ~ : bold close
  */
  $intro="#";
  $intro="This terminal is still under work. Start with '/BHelp' to learn the commands.";

  $intro_run=1;

  function find_tab_completed_command(command) {
    if (!command)
      return command;

    var commands = ['help', 'clear', 'reboot'];
    for (var i = 0; i < pages.length; i ++) {
      var page = pages[i];
      commands.push(page.command);
    }

    /* Loop through the list of commands and find if there is enough information for a single match */
    var results = [];
    for (var i = 0; i < commands.length; i ++) {
      if (commands[i].startsWith(command)) {
        results.push(commands[i]);
      }
    }

    if (results.length == 1) {
      /* One result, lets use it */
      console.log("Found tab result: " + results[0]);
      return results[0];
    }

    console.log("Too many matching results or no results found");
    if (results.length > 0) {
      var response = "print:" + command + ":";
      for (var i = 0; i < results.length - 1; i ++) {
        response += results[i] + ":";
      }
      response += results[results.length - 1];
      runcommand(response);
    }

    return command;
  }

  function show_available_commands() {
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

  $type=setInterval(function(){
            writeintro();
            },15);

  function writeintro(){
      $html=$('#introdiv').html();
      if($p<$intro.length-1 && $intro_run==1){
        if($intro[$p]=='#') $('#introdiv').html($html+'<br>');
        else if($intro[$p]=='%') $('#introdiv').html($html+'<span id="copy">&copy;');
        else if($intro[$p]=='*') $('#introdiv').html($html+'</span>');
        else if($intro[$p]=='/' && $intro[$p+1]=='B' && $intro[$p+2]=='H' && $intro[$p+3]=='e' && $intro[$p+4]=='l' && $intro[$p+5]=='p' ){
          $('#introdiv').html($html+'<b>help</b>');
          $p=$p+5;  
        } 
        else {
          $('#introdiv').html($html+$intro[$p]);
        }
      }
      else if($p>=$intro.length-1){
        clearInterval($type);
        $intro_run=0;
        $('#defaultline').show();
        $loadedintro=$('#introdiv').html();
        $loadedintro=$loadedintro.replace(/\^/g,'<b>');
        $loadedintro=$loadedintro.replace(/~/g,'</b>');
        $('#introdiv').html($loadedintro);
      }
      $p++;
  }

  function outputText(outputText) {
    $position = 0;
    $interval = setInterval(function() {
      writeText(outputText);
    }, 15);
  }

  function writeText(outputText) {
    var html = $('#line'+$l).html();
    if ($position < outputText.length - 1) {
      $('#line'+$l).html(html + outputText[$position]);
    } else if ($position >= outputText.length - 1) {
      clearInterval($interval);
      $('#defaultline').before('<div class="line" id="line'+$l+'"></div>');
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
    $position ++;
  }

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

  var $history=new Array();
  
  function runcommand($command){
    unnull();
    rehistory($command);
    $history[$z]=$command;
    $z++;
    $x=$z;
    $command=$command.toLowerCase();

    var extras = '';

    if($command=='cancelsending'){
     $command2='Cancelled';
     $msg=0;
     $msgcmd=0; 
    }
    else if ($command.startsWith("print")) {
      var results = $command.split(':');
      $command = "print";
      $command2 = results[1];
      for (var i = 2; i < results.length; i ++) {
        extras +=  results[i] + "&#09;";
      }
    }
    else $command2=$command;
    $('#defaultline').before('<div class="commandline" id="commandline'+$l+'"><span class="defaulttext">~ </span>'+$command2+'</div>');
    if($msg==0){
      switch($command){
        case 'help':
        $html=show_available_commands();
        break;

        case 'xyzzy':
        $html="Nothing happens";
        break;

        case 'clear':
        $clr=1;
        $msg=0;
        $html="";
        break;

        case '':
        $html="";
        break;

        case 'print':
        $html = extras;
        break;

        case 'reboot':
        $html="The system is going down for reboot NOW!<script>location.reload();</script>";
        break;

        default :
        $html="\'"+$command+"\' Is not a known Command. But that might change the next time you are here. Use '<b>help</b>' for the list of available commands";
        for (var i = 0; i < pages.length; i ++) {
          var page = pages[i];
          if ($command == page.command) {
            $html = page.page;
            break;
          }
        }
      }
    }

    outputText($html);
/*
    $('#defaultline').before('<div class="line" id="line'+$l+'"></div>');
    $('#line'+$l).html($html);
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
    */
  }

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
    if(e.altKey && (e.which == 83)) {
      
      /*send msg if $msg==1 which is activated when message command is typed*/
        if($msg==1){
          $sendact=1;
         runcommand($existing);
      }

     /*   return false; */
    }
    else if(e.ctrlKey && (e.which == 82)) {
     e.preventDefault();
      /*send msg if $msg==1 which is activated when message command is typed*/
        if($msg==1){
        if (confirm('Refreshing the Page with Discard Message!!') == true) {
              window.reload();
          } else {
              e.preventDefault();
              return false;
          }
      }

     /*   return false;*/
    }
    else if(e.altKey && (e.which == 67)) {
      
      /*send msg if $msg==1 which is activated when message command is typed*/
        if($msg==1){
          $msg=0;
         runcommand('cancelsending');
      }

     /*  return false;*/
    }
    else if(e.which==13){
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
});