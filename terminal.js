/* This code is based off code by Atul Bhats, you can see the original at http://atulbhats.com/terminal */
/* However there are a lot of changes and cleanups to make this work with wordpress with dynamic commands */
/* Allowing you to hopefully use Wordpress as you feel like it and this should dynamically work with it */

function ping($site){
  $clloc=$site.replace('.','');
  $clloc=$clloc.replace('-','');
  $('.ping'+$clloc).html("");
  http_ping($site,$clloc);

}

function hidedefault(){
  $('#defaultline').hide();
}

function skipintro($type){
  $intro_run=0;
  $introstop=true;
  $('#introdiv').html("");
  clearInterval($type);     
  $p==$intro.length;
  $intro=$intro.replace(/#/gi,'<br>');
  $intro=$intro.replace(/\/BHelp/gi,'<b>help</b>');
  $('#introdiv').html($intro);  
  $('#defaultline').show();
  clearInterval($type);   
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
  $asciia=0;
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
    var commands = ['help', 'clear', 'reload'];
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
    return command;
  }

  function show_available_commands() {
    var commands="<div class='help'>"+
        "<div>Interface Commands</div>"+
        "<div><b>help</b>Lists all available commands</div>"+
        "<div><b>clear</b>Clear the screen</div>"+
        "<div><b>reload</b>Reload this site</div>";
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
  var $cmdarray=new Array('help','clear');
  
  function runcommand($command){
    /*addcommand();*/
    unnull();
    rehistory($command);
    $history[$z]=$command;
    $z++;
    $x=$z;
    $command=$command.toLowerCase();

    if($command=='cancelsending'){
     $command2='Cancelled';
     $msg=0;
     $msgcmd=0; 
    }
    else $command2=$command;
    $('#defaultline').before('<div class="commandline" id="commandline'+$l+'"><span class="defaulttext">user@thispageisblank : ~$ </span>'+$command2+'</div>');
    if($msg==0){
      switch($command){
        case 'hi':
        case 'hello':
        $html=$command+" to you too! Please type <b>help</b> and hit enter for info on commands. For just the list, type <b>ls</b>";
        break;

        case 'user':
        $html="The only info I have is you are nothing, and that's the most I can find out about you. Anyways thanks for visiting";
        break;

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

        case 'reload':
        $html="<script>location.reload();</script>";
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

    $('#defaultline').before('<div class="line" id="line'+$l+'"></div>');
    if($asciia==1){
      $html=$html.replace(/~/g,"&nbsp;");
      $html=$html.replace(/#/g,'<br>');     
      $asciia=0;
    }
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

  }

  $(document).bind('keyup', function(e) {
    $existing=$('#commandcontainer').text();

    if(e.which==27 && $intro_run==1){
      skipintro($type);
    }
    else if(e.which==38){
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
      $('#commandcontainer').text(find_tab_completed_command(existing));
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