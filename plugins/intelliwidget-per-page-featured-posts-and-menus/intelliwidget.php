<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

/*
    Plugin Name: IntelliWidget Featured Posts and Custom Menus
    Plugin URI: http://www.lilaeamedia.com/plugins/intelliwidget
    Description: Display custom menus, featured posts, custom post types, metadata and other content on a per-page/post or site-wide basis.
    Version: 2.2.1
    Author: Lilaea Media
    Author URI: http://www.lilaeamedia.com/
    Text Domain: intelliwidget
    Domain Path: /lang
    License: GPLv2
    * *************************************************************************
    Copyright (C) 2013-2015 Lilaea Media LLC
    Portions inspired by Featured Page Widget 
    Copyright (C) 2009-2011 GrandSlambert http://grandslambert.com/
*/
class IntelliWidget {
    static $instance;
    var $pluginName;
    var $shortName;
    var $menuName;
    var $admin_hook;
    var $dir;
    var $shortcode_id = 0;
    var $pro_link;
    /**
     * Object constructor
     * @param <string> $file
     * @return void
     */
    function __construct() {
        self::$instance = $this;
        /* Load the language support */
        $lang_dir             = INTELLIWIDGET_DIR . '/lang';
        // sorry, only english for now (stub)
        load_plugin_textdomain( 'intelliwidget', FALSE, $lang_dir, $lang_dir );
        /* Plugin Details */
        $this->pluginName   = __( 'IntelliWidget', 'intelliwidget' );
        $this->shortName    = __( 'IntelliWidget', 'intelliwidget' );
        $this->menuName     = 'intelliwidget';
        $this->pro_link          = '<a href="' . LILAEAMEDIA_URL . '" target="_blank">' . __( 'our website', 'intelliwidget' ) . '</a>';     
        add_shortcode( 'intelliwidget',  array( &$this, 'intelliwidget_shortcode' ) );
        add_action( 'plugins_loaded',    array( &$this, 'intelliwidget_activate' ) );
        add_action( 'after_setup_theme', array( &$this, 'ensure_post_thumbnails_support' ) );
    }

    /**
     * Stub for plugin activation
     */
    function intelliwidget_activate() {
        // notice to upgrade to IntelliWidget Pro if using old ATX plugin
        if ( defined( 'INTELLIWIDGET_ATX_VERSION' ) ):
            add_action( 'admin_notices',         array( &$this, 'install_warning' ) );
            add_action( 'network_admin_notices', array( &$this, 'install_warning' ) );
            // disable ATX as it will cause errors
            add_action( 'admin_init',            array( &$this, 'deactivate_atx' ) );
            
        endif;
    }

    function install_warning() {
?>
<div class="error">
  <p>
<?php printf( __( 'IntelliWidget for Multi Post Pages is not compatible with this version of IntelliWidget. Please visit %s for a free upgrade to IntelliWidget Pro.','intelliwidget' ), $this->pro_link ); ?>
  </p>
</div>
<?php
    }
    
    function deactivate_atx() {
        if ( isset( $_GET[ 'action' ] ) && 'activate' == $_GET[ 'action' ] && 'intelliwidget-multi-post/intelliwidget-multi-post.php' == $_GET[ 'plugin' ] )
            unset( $_GET[ 'action' ] );
        elseif ( isset( $_GET[ 'activate' ] ) )
            unset( $_GET[ 'activate' ] );
        if ( current_user_can( 'activate_plugins' ) )
            deactivate_plugins( 'intelliwidget-multi-post/intelliwidget-multi-post.php' );
    }
    // semaphore to create options page once
    function set_admin_hook( $hook ) {
        $this->admin_hook = $hook;
    }
    
    function get_meta( $id, $optionname, $objecttype, $index = NULL ) {
        // are there settings for this widget?
        if ( !empty( $id ) && !empty( $objecttype ) ):
            switch( $objecttype ):
                case 'post':               
                    if ( isset( $index ) ) $optionname .= $index;
                    $instance = maybe_unserialize( get_post_meta( $id, $optionname, TRUE ) );
                    break;
                default:
                    $optionname = 'intelliwidget_data_' . $objecttype . '_' . $id;
                    if ( $data = get_option( $optionname ) ):
                        if ( isset( $index ) && isset( $data[ $index ] ) ):
                            $instance = $data[ $index ];
                        endif;
                    endif;
            endswitch;
            if ( isset( $instance ) ):
                if ( is_array( $instance ) && isset( $instance[ 'custom_text' ] ) )
                    // base64 encoding saves us from markup serialization heartburn
                    $instance[ 'custom_text' ] = stripslashes( base64_decode( $instance[ 'custom_text' ] ) );
                return $instance;
            endif;
        endif;
        return FALSE;
    }

    function get_box_map( $id, $objecttype ) {
        if ( !empty( $id ) && !empty( $objecttype ) ):
            if ( $data = $this->get_meta( $id, '_intelliwidget_', $objecttype, 'map' ) ) 
                return $data;
        endif;
        return array();
    }
    
    /**
     * For customized pages, retrieve the page-specific instance settings for the particular widget
     * being replaced
     *
     * @param <integer> $post_id
     * @param <string> $widget_id
     * @return <array> if exists or FALSE if empty
     */
    function get_settings_data( $id, $widget_id, $objecttype ) {
        // the box map stores meta box => widget id relations in page meta data
        $box_map = $this->get_box_map( $id, $objecttype );
        if ( is_array( $box_map ) ):
            $widget_map = array_flip( $box_map );
            // if two boxes point to the same widget, the second gets clobbered here
            if ( array_key_exists( $widget_id, $widget_map ) ):
                $box_id = $widget_map[ $widget_id ];
                // are there settings for this widget?
                if ( $instance = $this->get_meta( $id, '_intelliwidget_data_', $objecttype, $box_id ) ):
                    return $instance;
                endif;
            endif;
        endif;
        // all failures fall through gracefully
        return FALSE;
    }

    /**
     * Shortcode handler
     *
     * @global <object> $intelliwidget
     * @global <object> $post
     * @global <array> $this_instance
     * @param <array> $atts
     * @return <string>
     */

    function intelliwidget_shortcode( $atts ) {
        global $post;
        // section parameter lets us use page-specific IntelliWidgets in shortcode without all the params
        if ( is_object( $post ) && !empty( $atts[ 'section' ] ) ):
            $section = intval( $atts[ 'section' ] );
            $other_post_id = $this->get_meta( $post->ID, '_intelliwidget_', 'post', 'widget_page_id' );
            $shortcodePostID = $other_post_id ? $other_post_id : $post->ID;
            $atts = $this->get_meta( $shortcodePostID, '_intelliwidget_data_', 'post', $section );
            if ( empty( $atts ) ): 
                return;
            endif;
        else:
            $section = ++$this->shortcode_id;
            if ( !empty( $atts[ 'custom_text' ] ) ) unset( $atts[ 'custom_text' ] );
            if ( !empty( $atts[ 'text_position' ] ) ) unset( $atts[ 'text_position' ] );
            if ( !empty( $atts[ 'title' ] ) ) $atts[ 'title' ] = strip_tags( $atts[ 'title' ] );
            if ( !empty( $atts[ 'link_text' ] ) ) $atts[ 'link_text' ] = strip_tags( $atts[ 'link_text' ] );
            // backwards compatability: if nav_menu has value, add attr 'content=nav_menu' 
            if ( !empty( $atts[ 'nav_menu' ] ) ) $atts[ 'content' ] = 'nav_menu';
        endif;
        $atts = $this->defaults( $atts );
        $args = array(
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
            'before_widget' => empty( $atts[ 'nav_menu' ] ) ? '<div id="intelliwidget_' . $section . '" class="widget_intelliwidget">' : '',
            'after_widget'  => empty( $atts[ 'nav_menu' ] ) ? '</div>' : '',
        );
        // buffer standard output
        ob_start();
        // generate widget from arguments
        $this->build_widget( $args, $atts );
        // retrieve widget content from buffer
        $content = ob_get_contents();
        ob_end_clean();
        // return widget content
        return $content;
    }
    
    /**
     * Output the widget using selected template
     *
     * @param <array> $args
     * @param <array> $instance
     * @return void
     */
    function build_widget( $args, $instance, $post_id = NULL ) {
        global $this_instance;
        $instance = $this_instance = $this->defaults( $instance );

        extract( $args, EXTR_SKIP );

        // render before widget argument
        echo apply_filters( 'intelliwidget_before_widget', $before_widget, $instance, $args );
        // handle title
        if ( !empty( $instance[ 'title' ] ) && empty( $instance[ 'hide_title' ] ) ):
            echo apply_filters( 'intelliwidget_before_title', $before_title, $instance, $args );
            echo apply_filters( 'intelliwidget_title', $instance[ 'title' ], $instance, $args );
            echo apply_filters( 'intelliwidget_after_title', $after_title, $instance, $args );
        endif;
        // handle custom text above content
        do_action( 'intelliwidget_above_content', $instance, $args );
        // use action hook to render content
        if ( has_action( 'intelliwidget_action_' . $instance[ 'content' ] ) )
            do_action( 'intelliwidget_action_' . $instance[ 'content' ], $instance, $args, $post_id );
        // handle custom text below content
        do_action( 'intelliwidget_below_content', $instance, $args );
        // render after widget argument
        echo apply_filters( 'intelliwidget_after_widget', $after_widget, $instance, $args );
    }
    
    /**
     * Ensure that "post-thumbnails" support is available for those themes that don't register it.
     * @return  void
     */
    public function ensure_post_thumbnails_support () {
        if ( ! current_theme_supports( 'post-thumbnails' ) ) { add_theme_support( 'post-thumbnails' ); }
    } // End ensure_post_thumbnails_support()

    /**
     * Widget Defaults
     * This will utilize an options form in a future release for customization
     * @param <array> $instance
     * @return <array> -- merged data
     */
    public function defaults( $instance = array() ) {
        //if ( empty( $instance ) ) $instance = array();
        $defaults = apply_filters( 'intelliwidget_defaults', array(
            // these apply to all intelliwidgets
            'content'           => 'post_list', // this is the main control, determines hook to use
            'nav_menu'          => '', // built-in extension, uses wordpress menu instead of post_list
            'title'             => '',
            'link_title'        => 0,
            'classes'           => '',
            'container_id'      => '',
            'custom_text'       => '',
            'text_position'     => '',
            'filter'            => 0,
            'hide_if_empty'     => 0,      // applies to site-wide intelliwidgets
            'replace_widget'    => 'none', // applies to post-specific intelliwidgets
            'nocopy'            => 0,      // applies to post-specific intelliwidgets
            // these apply to post_list intelliwidgets
            'post_types'        => array( 'page', 'post' ),
            'template'          => 'menu',
            'page'              => array(), // stores any post_type, not just pages
            'category'          => -1, // legacy value, convert to tax_id
            'terms'             => -1,
            'items'             => 5,
            'sortby'            => 'title',
            'sortorder'         => 'ASC',
            'skip_expired'      => 0,
            'skip_post'         => 0,
            'future_only'       => 0,
            'active_only'       => 0,
            'include_private'   => 0,
            // these apply to post_list items
            'length'            => 15,
            'link_text'         => __( 'Read More', 'intelliwidget' ),
            'allowed_tags'      => '',
            'imagealign'        => 'none',
            'image_size'        => 'none',
            // these apply to taxonomy menus
            'hide_empty'        => 1,
            'show_count'        => 0,
            'current_only'      => 0,
            'show_descr'        => 0,
            'taxonomy'          => '',
            'hierarchical'      => 1,
            'sortby'            => 'menu_order',
            'hide_title'        => 0,
            'allterms'          => 0,
        ) );
        // backwards compatibility: add content=nav_menu if nav_menu param set
        if ( empty( $instance[ 'content' ] ) && !empty( $instance[ 'nav_menu' ] ) && '' != ( $instance[ 'nav_menu' ] ) ) 
            $instance[ 'content' ] = 'nav_menu';
        // standard WP function for merging argument lists
        $merged = wp_parse_args( $instance, $defaults );
        return $merged;
    }
    
}

define( 'INTELLIWIDGET_VERSION', '2.2.1' );
defined( 'LILAEAMEDIA_URL' ) || define( 'LILAEAMEDIA_URL', 'http://www.lilaeamedia.com' );
define( 'INTELLIWIDGET_DIR', dirname( __FILE__ ) );
define( 'INTELLIWIDGET_URL', plugin_dir_url( __FILE__ ) );

if ( !is_admin() ) include_once( 'includes/template-tags.php' );
include_once( 'includes/class-intelliwidget-widget.php' );
include_once( 'includes/class-intelliwidget-post.php' );
include_once( 'includes/class-intelliwidget-query.php'  );
    
new IntelliWidget();