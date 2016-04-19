<?php 
/**
 * Plugin Name: Socials + HTML Widget
 * Plugin URI: 
 * Description: Facebook and Twitter icons with custom HTML below
 * Author: Valery V. Krukov
 * Version: 0.0.1
 * Author URI:
 */

require_once dirname(__FILE__).'/widget.php';

function shw_load_widget(){
	register_widget('Socials_Plus_Html_Widget');
	register_sidebar( array(
		'name'=>__('Special Sidebar'),
		'id'=>'sidebar-special',
		'description'=>__('Special Widgets'),
		'before_widget'=>'',
		'after_widget'=>'',
		'before_title'=>'<h3 class="widget-title">',
		'after_title'=>'</h3>',
	) );
}
add_action('widgets_init','shw_load_widget');