<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * class-intelliwidget-widget-admin.php - IntelliWidget Widget Admin Class
 *
 * @package IntelliWidget
 * @subpackage includes
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */

include_once( 'class-intelliwidget-admin.php' );
class IntelliWidget_WidgetAdmin extends IntelliWidgetAdmin {

    /**
     * Constructor
     */
    function __construct() {
        add_action( 'load-widgets.php',                  array( &$this, 'admin_init' ) );
        add_action( 'wp_ajax_iw_widget_menus',           array( &$this, 'ajax_get_widget_post_select_menus' ) );
        $this->form_init();
    }
    
    
    /**
     * Widget Update method
     * @param <array> $new_instance
     * @param <array> $old_instance
     * @return <array>
     */
    function update( $new_instance, $old_instance ) {
        $textfields = $this->get_text_fields();
        foreach ( $new_instance as $name => $value ):
            // special handling for text inputs
            if ( in_array( $name, $textfields ) ):
                if ( current_user_can( 'unfiltered_html' ) ):
                    $old_instance[ $name ] =  $value;
                else:
                    // raw html parser/cleaner-upper: see WP docs re: KSES
                    $old_instance[ $name ] = stripslashes( 
                    wp_filter_post_kses( addslashes( $value ) ) ); 
                endif;
            else:
                $old_instance[ $name ] = $this->filter_sanitize_input( $value );
            endif;
            // handle multi selects that may not be passed or may just be empty
            if ( 'page_multi' == $name && empty( $new_instance[ 'page' ] ) )
                $old_instance[ 'page' ] = array();
            if ( 'terms_multi' == $name && empty( $new_instance[ 'terms' ] ) )
                $old_instance[ 'terms' ] = array();
        endforeach;
        foreach ( $this->get_checkbox_fields() as $name )
            $old_instance[ $name ] = isset( $new_instance[ $name ] );
            
        return $old_instance;
    }
    /**
     * Output Widget form
     *
     * @param <array> $instance
     */
    function render_form( $obj, $instance ) {
        // initialize admin object in case form is called outside of widgets page
        if ( !isset( $this->objecttype ) ) $this->admin_init();
        $instance = $this->iw()->defaults( $instance );
        $this->form->render_form( $this, $obj, $instance, TRUE );
    }
        
    // widgets only
    function ajax_get_widget_post_select_menus() {
        global $wp_registered_widgets;
        $widget_id = sanitize_text_field( $_POST[ 'widget-id' ] );
        if ( empty( $widget_id ) || 
            !$this->validate_post( 'save-sidebar-widgets', '_wpnonce_widgets', 'edit_theme_options', TRUE ) 
            ) return FALSE;
        $this->admin_init();
        // getting to the widget info is a complicated task ...
        if ( isset( $wp_registered_widgets[ $widget_id ] ) ):
            if ( isset( $wp_registered_widgets[ $widget_id ][ 'callback' ] ) && isset( $wp_registered_widgets[ $widget_id ][ 'params' ] )
                && count( $wp_registered_widgets[ $widget_id ][ 'callback' ] ) && count( $wp_registered_widgets[ $widget_id ][ 'params' ] ) ):
                    $widget = $wp_registered_widgets[ $widget_id ][ 'callback' ][ 0 ];
                    $params = $wp_registered_widgets[ $widget_id ][ 'params' ][ 0 ];
                    $settings = $widget->get_settings( $widget_id );
                    $instance = $settings[ $params[ 'number' ] ];
                    include_once( 'class-intelliwidget-form.php' );
                    $this->form_init();
                    ob_start();
                    $this->form->post_selection_menus( $this, $widget, $instance );
                    $form = ob_get_contents();
                    ob_end_clean();
                    die( $form );
            endif;
        endif;
        die( 'fail' );
    }
  
}
