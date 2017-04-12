<!DOCTYPE HTML>
  <head>
    <title>This Page is Blank</title>
    <meta charset="utf-8">
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="This Page is Blank" />
    <meta property="og:description" content="Personal trials and tribulations" />
    <meta property="og:url" content="https://thispageisblank.net/" />
    <meta property="og:keywords" content="Code, Command Line, Projects" />
    <meta property="og:site_name" content="This Page is Blank" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="Code, Command Line, Projects">
    <meta name="description" content="Personal site of Rajesh Singh">
    <meta property="og:image" content="favicon.ico" />
    <meta name="robots" content="index,follow">
    <link href='https://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script type="text/javascript" src="terminal.js"></script>
    <link rel='stylesheet' href='style.css' type='text/css' media='all' />
    <?php echo $script; ?>
    <script>
        $(document).on('click','#defaultline', function(){
        $('#actualinput').focus();
});
</script>
  </head>
  <body>
    <noscript>
      <div class="line"><span class="defaulttext">welcome@thispageisblank : ~$ </span> This page is blank.</div></br>
      <div class="line"><span class="defaulttext">no_javascript@thispageisblank : ~$ </span> It looks like Javascript has been disabled on your browser. This website runs on javascript for user experience. Please enable it and reload the website.</div><br>
    </noscript>
    <div id="introdiv">
        <span class="defaulttext">user@thispageisblank : ~$  </span><span id="commandcontainer">Oops! Jquery could not be loaded. The connection was either too slow or interrupted. Please Reload the page for a better UX.</span>
    </div>
    <div id="commands">
      <div id="defaultline"><span class="defaulttext">user@thispageisblank : ~$  </span><span id="commandcontainer"></span><span class="cursor"></span><input type="text" id="actualinput"></div>
    </div>
  </body>
</html>
