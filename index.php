<!DOCTYPE HTML>
<html lang="en">
  <head>
    <title><?php echo get_bloginfo( 'name' ); ?></title>
    <meta charset="utf-8">
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo get_bloginfo( 'name' ); ?>" />
    <meta property="og:description" content="<?php echo get_bloginfo( 'description' ); ?>" />
    <meta property="og:url" content="https://thispageisblank.net/" />
    <meta property="og:keywords" content="Code, Command Line, Projects" />
    <meta property="og:site_name" content="This Page is Blank" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="Code, Command Line, Projects">
    <meta name="description" content="<?php echo get_bloginfo( 'description' ); ?>">
    <meta property="og:image" content="favicon.ico" />
    <meta name="robots" content="index,follow">
    <link href='https://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>
      var pages = [];
      <?php
       $pages = get_pages();
        foreach ($pages as $key => $page) {
       ?>
      pages[<?php echo $key; ?>] = {command: "<?php echo $page->post_name; ?>", title: "<?php echo $page->post_title; ?>", page: "<?php echo $page->post_content; ?>"};
      <?php
        }
       ?>
    </script>
    <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/terminal.js"></script>
    <link rel='stylesheet' href='<?php bloginfo('template_directory'); ?>/style.css' type='text/css' media='all' />
    <script>
        $(document).on('click','#defaultline', function() {
          $('#actualinput').focus();
        });
        $(document).on('tap', function() {
          $('#actualinput').focus();
        });
    </script>
    <?php wp_head(); ?>
</head>
<body>
  <div class="container">
    <noscript>
      <div class="line"><span class="defaulttext">~ </span> It looks like javascript has been disabled on your browser. This website runs on javascript for user experience. Please enable it and refresh the website.</div><br>
    </noscript>
    <div id="introdiv">
        <span class="defaulttext">~  </span><span id="commandcontainer">There have been issues with the scripts required. Please refresh the browser to try again.</span>
    </div>
    <div id="commands">
      <div id="defaultline">
        <span class="defaulttext">~  </span><span id="commandcontainer"></span><span class="cursor"></span><input type="text" id="actualinput">
      </div>
    </div>
  </div>
</body>
</html>
