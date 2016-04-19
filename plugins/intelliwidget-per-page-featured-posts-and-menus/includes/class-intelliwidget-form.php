<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * class-intelliwidget-form.php - Outputs widget form
 *
 * @package IntelliWidget
 * @subpackage includes
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */
class IntelliWidgetForm {
    
    function render_form( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) {
        add_action( 'intelliwidget_form_all_before', array( $this, 'general_settings' ), 10, 5 );
        add_action( 'intelliwidget_form_post_list',  array( $this, 'post_selection_settings' ), 5, 5 );
        add_action( 'intelliwidget_form_post_list',  array( $this, 'appearance_settings' ), 10, 5 );
        add_action( 'intelliwidget_form_nav_menu',   array( $this, 'nav_menu' ), 10, 5 );
        add_action( 'intelliwidget_form_tax_menu',   array( $this, 'tax_menu' ), 10, 5 );
        add_action( 'intelliwidget_form_all_after',  array( $this, 'addl_text_settings' ), 10, 5 );
//widget only:
        if ( isset( $_POST[ 'widget-id' ] ) ) add_action( 'intelliwidget_post_selection_menus', array( $this, 'post_selection_menus' ), 10, 4 );
        ?>
<input type="hidden" id="<?php echo $widgetobj->get_field_id( 'category' ); ?>" name="<?php echo $widgetobj->get_field_name( 'category' ); ?>" value="-1" />
<?php if ( !$is_widget ): ?>
<p><?php echo apply_filters( 'intelliwidget_nocopy_setting', '
  <label title="' . $adminobj->get_tip( 'nocopy' ) . '">
    <input id="' . $widgetobj->get_field_id( 'nocopy' ). '" name="' . $widgetobj->get_field_name( 'nocopy' ) . '" type="checkbox" ' . checked( $instance[ 'nocopy' ], 1, FALSE ) . ' value="1"/> ' . $adminobj->get_label( 'nocopy' ) . '
  </label>
' ); ?>
</p><?php endif; ?>
<p> <?php if ( $is_widget ) echo $adminobj->docsLink; ?>
<?php if ( $is_widget ): ?>
  <label title="<?php echo $adminobj->get_tip( 'hide_if_empty' ); ?>">
    <input class="iw-widget-control" name="<?php echo $widgetobj->get_field_name( 'hide_if_empty' ); ?>" id="<?php echo $widgetobj->get_field_id( 'hide_if_empty' ); ?>" type="checkbox" <?php checked( $instance[ 'hide_if_empty' ], 1 ); ?> value="1"/><?php echo $adminobj->get_label( 'hide_if_empty' ); ?>  </label>
<?php else: ?>    
      <input type="hidden" id="<?php echo $widgetobj->get_field_id( 'box_id' ); ?>" name="<?php echo $widgetobj->get_field_name( 'box_id' ); ?>" value="<?php echo $widgetobj->box_id; ?>" />
  <label title="<?php echo $adminobj->get_tip( 'replace_widget' ); ?>" for="<?php echo $widgetobj->get_field_id( 'box_id' ); ?>">
    <?php echo $adminobj->get_label( 'replace_widget' ); ?>
    : </label>
  <select name="<?php echo $widgetobj->get_field_name( 'replace_widget' ); ?>" id="<?php echo $widgetobj->get_field_id( 'replace_widget' ); ?>">
    <?php foreach ( $adminobj->intelliwidgets as $value => $label ): ?>
    <option value="<?php echo $value; ?>" <?php selected( $instance[ 'replace_widget' ], $value ); ?>><?php echo $label; ?></option>
    <?php endforeach; ?>
  </select>
<?php endif; ?>
</p>
<?php // execute custom action hook for content value if it exists
        if ( empty( $instance[ 'hide_if_empty' ] ) ):
            do_action( 'intelliwidget_form_all_before', $adminobj, $widgetobj, $instance, $is_widget );
            do_action( 'intelliwidget_form_' . $instance[ 'content' ], $adminobj, $widgetobj, $instance, $is_widget );
            do_action( 'intelliwidget_form_all_after', $adminobj, $widgetobj, $instance, $is_widget );
        endif;
        if ( !$is_widget ): ?>
<span class="submitbox" style="float:left;"><a href="<?php echo $adminobj->get_nonce_url( $widgetobj->post_id, 'delete', $widgetobj->box_id ); ?>" id="iw_delete_<?php echo $widgetobj->post_id . '_' . $widgetobj->box_id; ?>" class="iw-delete submitdelete">
<?php _e( 'Delete', 'intelliwidget' ); ?>
</a></span><div class="iw-save-container" style="float:right"><input name="save" class="button button-large iw-save" id="<?php echo $widgetobj->get_field_id( 'save' ); ?>" value="<?php _e( 'Save Settings', 'intelliwidget' ); ?>" type="button" autocomplete="off" /></div>
  <span class="spinner <?php echo $widgetobj->get_field_id( 'spinner' ); ?>"></span>

<div style="clear:both"></div><?php 
        endif;       
    }

    function section_header( $adminobj, $widgetobj, $sectionkey, $is_widget ) {

        printf(
            '<div class="postbox iw-collapsible closed panel-%4$s" id="%1$s' 
            . ( $is_widget ? '-panel' : '' ) . '" title="' . __( 'Click to toggle', 'intelliwidget' ) . '">'
            . '<div class="handlediv" title="' . __( 'Click to toggle', 'intelliwidget' ) . '"></div>'
            . ( $is_widget ?  '<h4' : '<h3 class="hndle"' ) . ' title="%2$s">'
            . ( $is_widget ? '' : '<span>' ) . '%3$s' 
            . ( $is_widget ? '</h4>' : '</span></h3>' ) . '<div id="%1$s' 
            . ( $is_widget ? '-panel-inside' : '_inside' ) . '" class="inside">', 
            $widgetobj->get_field_id( $sectionkey ),
            $adminobj->get_tip( $sectionkey ),
            $adminobj->get_label( $sectionkey ),
            $sectionkey
        );
    }
        
    function general_settings( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) { 
        $this->section_header( $adminobj, $widgetobj, 'generalsettings', $is_widget );
        ?>
    
    <p>
      <label title="<?php echo $adminobj->get_tip( 'content' );?>" for="<?php echo $widgetobj->get_field_id( 'content' ); ?>">
        <?php echo $adminobj->get_label( 'content' ) ?>
        : </label>
      <select class="iw<?php echo $is_widget? '-widget' : ''; ?>-control" id="<?php echo $widgetobj->get_field_id( 'content' ); ?>" name="<?php echo $widgetobj->get_field_name( 'content' ); ?>" autocomplete="off">
        <?php foreach ( $adminobj->get_content_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'content' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
      </select><?php if ( !$is_widget ): ?><span class="spinner <?php echo $widgetobj->get_field_id( 'spinner' ); ?>"></span><?php endif; ?>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'title' );?>" for="<?php echo $widgetobj->get_field_id( 'title' ); ?>"> <?php echo $adminobj->get_label( 'title' ); ?>: </label>
      <label title="<?php echo $adminobj->get_tip( 'link_title' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'link_title' ); ?>" id="<?php echo $widgetobj->get_field_id( 'link_title' ); ?>" type="checkbox" <?php checked( $instance[ 'link_title' ], 1 ); ?> value="1" />
        <?php echo $adminobj->get_label( 'link_title' ); ?>
      </label>
      <label title="<?php echo $adminobj->get_tip( 'hide_title' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'hide_title' ); ?>" id="<?php echo $widgetobj->get_field_id( 'hide_title' ); ?>" type="checkbox" <?php checked( $instance[ 'hide_title' ], 1 ); ?> value="1" />
        <?php echo $adminobj->get_label( 'hide_title' ); ?>
      </label>
      <br/>
      <input id="<?php echo $widgetobj->get_field_id( 'title' ); ?>" name="<?php echo $widgetobj->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $instance[ 'title' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'container_id' );?>" for="<?php echo $widgetobj->get_field_id( 'container_id' ); ?>">
        <?php echo $adminobj->get_label( 'container_id' ); ?>
        : </label>
      <input name="<?php echo $widgetobj->get_field_name( 'container_id' ); ?>" id="<?php echo $widgetobj->get_field_id( 'container_id' ); ?>" type="text" value="<?php echo esc_attr( $instance[ 'container_id' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'classes' );?>" for="<?php echo $widgetobj->get_field_id( 'classes' ); ?>">
        <?php echo $adminobj->get_label( 'classes' ); ?>
        : </label>
      <input name="<?php echo $widgetobj->get_field_name( 'classes' ); ?>" id="<?php echo $widgetobj->get_field_id( 'classes' ); ?>" type="text" value="<?php echo esc_attr( $instance[ 'classes' ] ); ?>" />
    </p>
  </div>
</div>
<?php
    }
    
    function addl_text_settings( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) { 
        $this->section_header( $adminobj, $widgetobj, 'addltext', $is_widget ); ?>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'text_position' );?>" for="<?php echo $widgetobj->get_field_id( 'text_position' ); ?>">
        <?php echo $adminobj->get_label( 'text_position' ); ?>
        : </label>
      <select name="<?php echo $widgetobj->get_field_name( 'text_position' ); ?>" id="<?php echo $widgetobj->get_field_id( 'text_position' ); ?>">
        <?php foreach ( $adminobj->get_text_position_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'text_position' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p>
      <textarea class="widefat" rows="3" cols="20" id="<?php echo $widgetobj->get_field_id( 'custom_text' ); ?>" 
name="<?php echo $widgetobj->get_field_name( 'custom_text' ); ?>"><?php echo esc_textarea( $instance[ 'custom_text' ] ); ?></textarea>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'filter' );?>">
        <input id="<?php echo $widgetobj->get_field_id( 'filter' ); ?>" name="<?php echo $widgetobj->get_field_name( 'filter' ); ?>" type="checkbox" <?php checked( $instance[ 'filter' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'filter' ); ?>
      </label>
    </p>
  </div>
</div>
<?php
    }

    function appearance_settings( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) { 
        global $_wp_additional_image_sizes;
        $this->section_header( $adminobj, $widgetobj, 'appearance', $is_widget ); ?>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'template' );?>" for="<?php echo $widgetobj->get_field_id( 'template' ); ?>">
        <?php echo $adminobj->get_label( 'template' ); ?>
        :</label>
      <select name="<?php echo $widgetobj->get_field_name( 'template' ); ?>" id="<?php echo $widgetobj->get_field_id( 'template' ); ?>">
        <?php foreach ( $adminobj->templates as $template => $name ) : ?>
        <option value="<?php echo $template; ?>" <?php selected( $instance[ 'template' ], $template ); ?>><?php echo $name; ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'sortby' );?>" for="<?php echo $widgetobj->get_field_id( 'sortby' ); ?>">
        <?php echo $adminobj->get_label( 'sortby' ); ?>
        : </label>
      <select name="<?php echo $widgetobj->get_field_name( 'sortby' ); ?>" id="<?php echo $widgetobj->get_field_id( 'sortby' ); ?>">
        <?php foreach ( $adminobj->get_sortby_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'sortby' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
      </select>
      <select name="<?php echo $widgetobj->get_field_name( 'sortorder' ); ?>" id="<?php echo $widgetobj->get_field_id( 'sortorder' ); ?>">
        <option value="ASC"<?php selected( $instance[ 'sortorder' ], 'ASC' ); ?>>
        <?php _e( 'ASC', 'intelliwidget' ); ?>
        </option>
        <option value="DESC"<?php selected( $instance[ 'sortorder' ], 'DESC' ); ?>>
        <?php _e( 'DESC', 'intelliwidget' ); ?>
        </option>
      </select>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'items' );?>" for="<?php echo $widgetobj->get_field_id( 'items' ); ?>">
        <?php echo $adminobj->get_label( 'items' ); ?>
        : </label>
      <input id="<?php echo $widgetobj->get_field_id( 'items' ); ?>" name="<?php echo $widgetobj->get_field_name( 'items' ); ?>" size="3" type="text" value="<?php echo esc_attr( $instance[ 'items' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'length' );?>" for="<?php echo $widgetobj->get_field_id( 'length' ); ?>">
        <?php echo $adminobj->get_label( 'length' ); ?>
        : </label>
      <input id="<?php echo $widgetobj->get_field_id( 'length' ); ?>" name="<?php echo $widgetobj->get_field_name( 'length' ); ?>" size="3" type="text" value="<?php echo esc_attr( $instance[ 'length' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'allowed_tags' );?>" for="<?php echo $widgetobj->get_field_id( 'allowed_tags' ); ?>">
        <?php echo $adminobj->get_label( 'allowed_tags' ); ?>
        : </label>
      <input name="<?php echo $widgetobj->get_field_name( 'allowed_tags' ); ?>" id="<?php echo $widgetobj->get_field_id( 'allowed_tags' ); ?>" type="text" value="<?php echo esc_attr( $instance[ 'allowed_tags' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'link_text' );?>" for="<?php echo $widgetobj->get_field_id( 'link_text' ); ?>">
        <?php echo $adminobj->get_label( 'link_text' ); ?>
        : </label>
      <input name="<?php echo $widgetobj->get_field_name( 'link_text' ); ?>" id="<?php echo $widgetobj->get_field_id( 'link_text' ); ?>" type="text" value="<?php echo esc_attr( $instance[ 'link_text' ] ); ?>" />
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'imagealign' );?>" for="<?php print $widgetobj->get_field_id( 'imagealign' ); ?>">
        <?php echo $adminobj->get_label( 'imagealign' ); ?>
        : </label>
      <select name="<?php print $widgetobj->get_field_name( 'imagealign' ); ?>" id="<?php print $widgetobj->get_field_id( 'imagealign' ); ?>">
        <?php foreach ( $adminobj->get_imagealign_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'imagealign' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'image_size' );?>" for="<?php print $widgetobj->get_field_id( 'image_size' ); ?>">
        <?php echo $adminobj->get_label( 'image_size' ); ?>
        : </label>
      <select id="<?php echo $widgetobj->get_field_id( 'image_size' ); ?>" name="<?php echo $widgetobj->get_field_name( 'image_size' ); ?>">
        <?php foreach ( $adminobj->get_image_size_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'image_size' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
        <?php if ( is_array( $_wp_additional_image_sizes ) ): foreach ( $_wp_additional_image_sizes as $name => $size ) : ?>
        <option value="<?php echo $name; ?>" <?php selected( $instance[ 'image_size' ], $name ); ?> ><?php echo $name; ?> ( <?php echo $size[ 'width' ]; ?>x<?php echo $size[ 'height' ]; ?>px )</option>
        <?php endforeach; endif;?>
      </select>
    </p>
  </div>
</div>
<?php
    }

    function post_selection_settings( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) { 
        $this->section_header( $adminobj, $widgetobj, 'selection', $is_widget ); ?>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'post_types' );?>" style="display:block">
        <?php echo $adminobj->get_label( 'post_types' ); ?>
        :</label>
      <?php foreach ( $adminobj->post_types as $type ) : ?>
      <label style="white-space:nowrap;margin-right:10px" for="<?php echo $widgetobj->get_field_id( 'post_types_' . $type ); ?>">
        <input class="iw<?php echo $is_widget? '-widget' : ''; ?>-control"  type="checkbox" id="<?php echo $widgetobj->get_field_id( 'post_types_' . $type ); ?>" name="<?php echo $widgetobj->get_field_name( 'post_types' ); ?>[]" value="<?php echo $type; ?>" <?php checked( in_array( $type, $instance[ 'post_types' ] ), 1 ); ?> />
        <?php echo ucfirst( $type ); ?></label>
      <?php endforeach; ?>
    </p>
    <div id="<?php echo $widgetobj->get_field_id( 'menus' ); ?>">
<?php  /*
        * this has been moved to its own method: post_selection_menus()
        */
         do_action( 'intelliwidget_post_selection_menus', $adminobj, $widgetobj, $instance );
        
?>
    </div>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'skip_post' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'skip_post' ); ?>" id="<?php echo $widgetobj->get_field_id( 'skip_post' ); ?>" type="checkbox" <?php checked( $instance[ 'skip_post' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'skip_post' ); ?>
      </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'future_only' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'future_only' ); ?>" id="<?php echo $widgetobj->get_field_id( 'future_only' ); ?>" type="checkbox" <?php checked( $instance[ 'future_only' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'future_only' ); ?>
      </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'active_only' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'active_only' ); ?>" id="<?php echo $widgetobj->get_field_id( 'active_only' ); ?>" type="checkbox" <?php checked( $instance[ 'active_only' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'active_only' ); ?>
      </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'skip_expired' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'skip_expired' ); ?>" id="<?php echo $widgetobj->get_field_id( 'skip_expired' ); ?>" type="checkbox" <?php checked( $instance[ 'skip_expired' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'skip_expired' ); ?>
      </label>
    </p>
<?php if ( current_user_can( 'read_private_posts' ) ): ?>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'include_private' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'include_private' ); ?>" id="<?php echo $widgetobj->get_field_id( 'include_private' ); ?>" type="checkbox" <?php checked( $instance[ 'include_private' ], 1 ); ?> value="1" />
        &nbsp;
        <?php echo $adminobj->get_label( 'include_private' ); ?>
      </label>
    </p>   
<?php endif; ?> 
  </div>
</div>
<?php
    }

    function post_selection_menus( $adminobj, $widgetobj, $instance ) {
        // convert legacy category to taxonomies
        if ( empty( $instance[ 'terms' ] ) && isset( $instance[ 'category' ] ) && '-1' != $instance[ 'category' ] )
            $instance[ 'terms' ] = $adminobj->map_category_to_tax( $instance[ 'category' ] );
       
?>
<input type="hidden" name="<?php echo $widgetobj->get_field_name( 'page_multi' ); ?>" id="<?php echo $widgetobj->get_field_id( 'page_multi' ); ?>" value="1" />
<input type="hidden" name="<?php echo $widgetobj->get_field_name( 'terms_multi' ); ?>" id="<?php echo $widgetobj->get_field_id( 'terms_multi' ); ?>" value="1" />
    <p>
      <label title="<?php echo $adminobj->get_tip( 'page' );?>">
        <?php echo $adminobj->get_label( 'page' );?>
        :</label>
      <select  class="widefat intelliwidget-multiselect" name="<?php echo $widgetobj->get_field_name( 'page' ); ?>[]"  multiple="multiple" id="<?php echo $widgetobj->get_field_id( 'page' ); ?>">
        <?php echo $adminobj->get_posts_list( $instance ); ?>
      </select>
    </p> 
    <p>
      <label title="<?php echo $adminobj->get_tip( 'terms' );?>">
        <?php echo $adminobj->get_label( 'terms' );?>
      </label>
      <select name="<?php echo $widgetobj->get_field_name( 'allterms' ); ?>" id="<?php echo $widgetobj->get_field_id( 'allterms' ); ?>">
        <option value="0"<?php if ( isset( $instance[ 'allterms' ] ) ) selected( $instance[ 'allterms' ], 0 ); ?>>
        <?php _e( 'any', 'intelliwidget' ); ?>
        </option>
        <option value="1"<?php if ( isset( $instance[ 'allterms' ] ) ) selected( $instance[ 'allterms' ], 1 ); ?>>
        <?php _e( 'all', 'intelliwidget' ); ?>
        </option>
      </select>
      <label title="<?php echo $adminobj->get_tip( 'allterms' ); ?>">
        <?php echo $adminobj->get_label( 'allterms' ); ?>
        :</label>
      <select class="widefat intelliwidget-multiselect" name="<?php echo $widgetobj->get_field_name( 'terms' ); ?>[]" size="1" multiple="multiple" id="<?php echo $widgetobj->get_field_id( 'terms' ); ?>">
        <?php echo $adminobj->get_terms_list( $instance ); ?>
      </select>
    </p>
<?php
    }
    function nav_menu( $adminobj, $widgetobj, $instance ) { 
        ?>
<p>
  <label title="<?php echo $adminobj->get_tip( 'nav_menu' );?>" for="<?php echo $widgetobj->get_field_id( 'nav_menu' ); ?>">
    <?php echo $adminobj->get_label( 'nav_menu' ); ?>
    : </label>
  <select id="<?php echo $widgetobj->get_field_id( 'nav_menu' ); ?>" name="<?php echo $widgetobj->get_field_name( 'nav_menu' ); ?>">
            <?php
            // Get menus
            foreach ( $adminobj->get_nav_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'nav_menu' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach;?>
  </select>
</p>
<?php 
    }

    function tax_menu( $adminobj, $widgetobj, $instance, $is_widget = FALSE ) { 
        $this->section_header( $adminobj, $widgetobj, 'taxmenusettings', $is_widget ); ?>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'taxonomy' );?>" for="<?php echo $widgetobj->get_field_id( 'taxonomy' ); ?>"> <?php echo $adminobj->get_label( 'taxonomy' ); ?> : </label>
      <select id="<?php echo $widgetobj->get_field_id( 'taxonomy' ); ?>" name="<?php echo $widgetobj->get_field_name( 'taxonomy' ); ?>">
        <?php
            // Get menus
            foreach ( $adminobj->get_tax_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'taxonomy' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach;?>
      </select>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'sortby_terms' ); ?>"> <?php echo $adminobj->get_label( 'sortby_terms' ); ?> : </label>
      <br/>
      <select name="<?php echo $widgetobj->get_field_name( 'sortby' ); ?>" id="<?php echo $widgetobj->get_field_id( 'sortby' ); ?>">
        <?php foreach ( $adminobj->get_tax_sortby_menu() as $value => $label ): ?>
        <option value="<?php echo $value; ?>" <?php selected( $instance[ 'sortby' ], $value ); ?>><?php echo $label; ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'show_count' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'show_count' ); ?>" id="<?php echo $widgetobj->get_field_id( 'show_count' ); ?>" type="checkbox" <?php checked( $instance[ 'show_count' ], 1 ); ?> value="1" />
        &nbsp; <?php echo $adminobj->get_label( 'show_count' ); ?> </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'hierarchical' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'hierarchical' ); ?>" id="<?php echo $widgetobj->get_field_id( 'hierarchical' ); ?>" type="checkbox" <?php checked( $instance[ 'hierarchical' ], 1 ); ?> value="1" />
        &nbsp; <?php echo $adminobj->get_label( 'hierarchical' ); ?> </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'current_only_all' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'current_only' ); ?>" id="<?php echo $widgetobj->get_field_id( 'current_only_all' ); ?>" type="radio" <?php checked( $instance[ 'current_only' ], 0 ); ?> value="0" />
        &nbsp; <?php echo $adminobj->get_label( 'current_only_all' ); ?> </label><br/>
      <label title="<?php echo $adminobj->get_tip( 'current_only_cur' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'current_only' ); ?>" id="<?php echo $widgetobj->get_field_id( 'current_only_cur' ); ?>" type="radio" <?php checked( $instance[ 'current_only' ], 1 ); ?> value="1" />
        &nbsp; <?php echo $adminobj->get_label( 'current_only_cur' ); ?> </label><br/>
      <label title="<?php echo $adminobj->get_tip( 'current_only_sub' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'current_only' ); ?>" id="<?php echo $widgetobj->get_field_id( 'current_only_sub' ); ?>" type="radio" <?php checked( $instance[ 'current_only' ], 2 ); ?> value="2" />
        &nbsp; <?php echo $adminobj->get_label( 'current_only_sub' ); ?> </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'show_descr' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'show_descr' ); ?>" id="<?php echo $widgetobj->get_field_id( 'show_descr' ); ?>" type="checkbox" <?php checked( $instance[ 'show_descr' ], 1 ); ?> value="1" />
        &nbsp; <?php echo $adminobj->get_label( 'show_descr' ); ?> </label>
    </p>
    <p>
      <label title="<?php echo $adminobj->get_tip( 'hide_empty' );?>">
        <input name="<?php echo $widgetobj->get_field_name( 'hide_empty' ); ?>" id="<?php echo $widgetobj->get_field_id( 'hide_empty' ); ?>" type="checkbox" <?php checked( $instance[ 'hide_empty' ], 1 ); ?> value="1" />
        &nbsp; <?php echo $adminobj->get_label( 'hide_empty' ); ?> </label>
    </p>
  </div>
</div>
<?php 
    }
    function post_cdf_form( $adminobj, $post ) {
        $keys = $adminobj->get_custom_fields();
        $custom_data = get_post_custom( $post->ID );
        $fields = array();
        foreach ( $keys as $field ):
            $key = 'intelliwidget_' . $field;
            $fields[ $key ] = empty( $custom_data[ $key ] ) ? '' : $custom_data[ $key ][ 0 ];
        endforeach;
?>
<p>
  <label title="<?php echo $adminobj->get_tip( 'event_date' ); ?>" for="intelliwidget_event_date">
    <?php echo $adminobj->get_label( 'event_date' );?>
    : <a href="#edit_timestamp" id="intelliwidget_event_date-edit" class="intelliwidget-edit-timestamp hide-if-no-js">
    <?php _e( 'Edit', 'intelliwidget' ) ?>
    </a> <span id="intelliwidget_event_date_timestamp" class="intelliwidget-timestamp"> <?php echo $fields[ 'intelliwidget_event_date' ] ?></span></label>
  <input type="hidden" class="intelliwidget-input" id="intelliwidget_event_date" name="intelliwidget_event_date" value="<?php echo $fields[ 'intelliwidget_event_date' ] ?>" autocomplete="off" />
<div id="intelliwidget_event_date_div" class="intelliwidget-timestamp-div hide-if-js">
  <?php $this->timestamp( 'intelliwidget_event_date', $fields[ 'intelliwidget_event_date' ] ); ?>
</div>
</p>
<p>
  <label title="<?php echo $adminobj->get_tip( 'expire_date' ); ?>" for="intelliwidget_expire_date">
    <?php echo $adminobj->get_label( 'expire_date' );?>
    : <a href="#edit_timestamp" id="intelliwidget_expire_date-edit" class="intelliwidget-edit-timestamp hide-if-no-js">
    <?php _e( 'Edit', 'intelliwidget' ) ?>
    </a> <span id="intelliwidget_expire_date_timestamp" class="intelliwidget-timestamp"> <?php echo $fields[ 'intelliwidget_expire_date' ]; ?></span></label>
  <input type="hidden" class="intelliwidget-input" id="intelliwidget_expire_date" name="intelliwidget_expire_date" value="<?php echo $fields[ 'intelliwidget_expire_date' ] ?>" autocomplete="off" />
<div id="intelliwidget_expire_date_div" class="intelliwidget-timestamp-div hide-if-js">
  <?php $this->timestamp( 'intelliwidget_expire_date', $fields[ 'intelliwidget_expire_date' ] ); ?>
</div>
</p>
<p>
  <label title="<?php echo $adminobj->get_tip( 'alt_title' );?>" for="intelliwidget_alt_title">
    <?php echo $adminobj->get_label( 'alt_title' );?>
    :</label>
  <input class="intelliwidget-input" type="text" id="intelliwidget_alt_title" name="intelliwidget_alt_title" value="<?php echo $fields[ 'intelliwidget_alt_title' ] ?>" autocomplete="off" />
</p>
<p>
  <label title="<?php echo $adminobj->get_tip( 'external_url' );?>" for="intelliwidget_external_url">
    <?php echo $adminobj->get_label( 'external_url' );?>
    :</label>
  <input class="intelliwidget-input" type="text" id="intelliwidget_external_url" name="intelliwidget_external_url" value="<?php echo $fields[ 'intelliwidget_external_url' ] ?>" autocomplete="off" />
</p>
<p>
  <label title="<?php echo $adminobj->get_tip( 'link_classes' );?>" for="intelliwidget_link_classes">
    <?php echo $adminobj->get_label( 'link_classes' );?>
    :</label>
  <input class="intelliwidget-input" type="text" id="intelliwidget_link_classes" name="intelliwidget_link_classes" value="<?php echo $fields[ 'intelliwidget_link_classes' ] ?>" autocomplete="off" />
</p>
<p>
  <label title="<?php echo $adminobj->get_tip( 'link_target' );?>" for="intelliwidget_link_target">
    <?php echo $adminobj->get_label( 'link_target' );?>
    :</label>
  <select class="intelliwidget-input" id="intelliwidget_link_target" name="intelliwidget_link_target" autocomplete="off" >
    <?php foreach ( $adminobj->get_link_target_menu() as $value => $label ): ?>
    <option value="<?php echo $value; ?>" <?php selected( $fields[ 'intelliwidget_link_target' ], $value ); ?>><?php echo $label; ?></option>
    <?php endforeach; ?>
  </select>
</p>
<div class="iw-cdf-container">
  <input name="save" class="iw-cdfsave button button-large" id="iw_cdfsave" value="<?php _e( 'Save Custom Fields', 'intelliwidget' );?>" type="button" style="float:right" />
  <span class="spinner" id="intelliwidget_cpt_spinner"></span> </div>
<?php wp_nonce_field( 'iwpage_' . $post->ID,'iwpage' ); ?>
<div style="clear:both"></div>
<?php
    }
    /**
     * Display timestamp edit fields for IntelliWidget
     *
     * @param <string> $field
     * @param <string> $post_date
     */
    function timestamp( $field = 'intelliwidget_event_date', $post_date = NULL ) {
        global $wp_locale;

        $time_adj = current_time( 'timestamp' );
        $jj = ( $post_date ) ? mysql2date( 'd', $post_date, FALSE ) : gmdate( 'd', $time_adj );
        $mm = ( $post_date ) ? mysql2date( 'm', $post_date, FALSE ) : gmdate( 'm', $time_adj );
        $aa = ( $post_date ) ? mysql2date( 'Y', $post_date, FALSE ) : gmdate( 'Y', $time_adj );
        $hh = ( $post_date ) ? mysql2date( 'H', $post_date, FALSE ) : gmdate( 'H', $time_adj );
        $mn = ( $post_date ) ? mysql2date( 'i', $post_date, FALSE ) : gmdate( 'i', $time_adj );
        $ss = ( $post_date ) ? mysql2date( 's', $post_date, FALSE ) : gmdate( 's', $time_adj );

        $cur_jj = gmdate( 'd', $time_adj );
        $cur_mm = gmdate( 'm', $time_adj );
        $cur_aa = gmdate( 'Y', $time_adj );
        $cur_hh = gmdate( 'H', $time_adj );
        $cur_mn = gmdate( 'i', $time_adj );

        $month = '<select id="'.$field.'_mm" name="'.$field.'_mm" class="intelliwidget-mm">' ."\n";
        for ( $i = 1; $i < 13; $i = $i +1 ) {
            $monthnum = zeroise( $i, 2 );
            $month .= "            " . '<option value="' . $monthnum . '"';
            if ( $i == $mm )
                $month .= ' selected="selected"';
                /* translators: 1: month number ( 01, 02, etc. ), 2: month abbreviation */
            $month .= '>' . $wp_locale->get_month_abbrev( $wp_locale->get_month( $i ) ) . "</option>\n";
        }
        $month .= '</select>';

        $day = '<input type="text" id="'.$field.'_jj" class="intelliwidget-jj" name="'.$field.'_jj" value="' . $jj . '" size="2" maxlength="2" autocomplete="off" />';
        $year = '<input type="text" id="'.$field.'_aa" class="intelliwidget-aa" name="'.$field.'_aa" value="' . $aa . '" size="4" maxlength="4" autocomplete="off" />';
        $hour = '<input type="text" id="'.$field.'_hh" class="intelliwidget-hh" name="'.$field.'_hh" value="' . $hh . '" size="2" maxlength="2" autocomplete="off" />';
        $minute = '<input type="text" id="'.$field.'_mn" class="intelliwidget-mn" name="'.$field.'_mn" value="' . $mn . '" size="2" maxlength="2" autocomplete="off" />';

        echo '<div class="timestamp-wrap">';
        /* translators: 1: month input, 2: day input, 3: year input, 4: hour input, 5: minute input */
        printf( __( '%1$s%2$s, %3$s @ %4$s : %5$s', 'intelliwidget' ), $month, $day, $year, $hour, $minute );

        echo '</div><input type="hidden" id="'.$field.'_ss" name="'.$field.'_ss" value="' . $ss . '" />';

        echo "\n\n";
        foreach ( array( 'mm', 'jj', 'aa', 'hh', 'mn' ) as $timeunit ) {
            echo '<input type="hidden" id="'.$field.'_hidden_' . $timeunit . '" name="'.$field.'_hidden_' . $timeunit . '" value="' . ( ( $post_date ) ? $$timeunit : '' ) . '" />' . "\n";
            $cur_timeunit = 'cur_' . $timeunit;
            echo '<input type="hidden" id="'. $field . '_' . $cur_timeunit . '" name="'. $field . '_' . $cur_timeunit . '" value="' . $$cur_timeunit . '" />' . "\n";
        }
?>
<p> <a href="#edit_timestamp" id="<?php echo $field; ?>-save" class="intelliwidget-save-timestamp hide-if-no-js button">
  <?php _e( 'OK', 'intelliwidget' ); ?>
  </a> <a href="#edit_timestamp" id="<?php echo $field; ?>-clear" class="intelliwidget-clear-timestamp hide-if-no-js button">
  <?php _e( 'Clear', 'intelliwidget' ); ?>
  </a> <a href="#edit_timestamp" id="<?php echo $field; ?>-cancel" class="intelliwidget-cancel-timestamp hide-if-no-js">
  <?php _e( 'Cancel', 'intelliwidget' ); ?>
  </a> </p>
<?php
    }
    
    function copy_form( $obj, $id, $id_list ) {
        
        echo $obj->docsLink; ?>
<p>
  <label title="<?php echo $obj->get_tip( 'widget_page_id' );?>" for="<?php echo 'intelliwidget_widget_page_id'; ?>">
    <?php echo $obj->get_label( 'widget_page_id' ); ?>
    : </label>  <?php echo $id_list; ?>
  <input name="save" class="iw-copy button button-large" id="iw_copy" value="<?php _e( 'Use', 'intelliwidget' ); ?>" type="button" style="max-width:24%;margin-top:4px" />
</p>
<?php
    }
    
    function add_form( $obj, $id ) {
?>
<div class="iw-copy-container"> <span class="spinner" id="intelliwidget_spinner"></span> </div>
<a title="<?php echo $obj->get_tip( 'iw_add' ); ?>" style="float:left;" href="<?php echo $obj->get_nonce_url( $id, 'add' ); ?>" id="iw_add_<?php echo $id; ?>" class="iw-add">
<?php echo $obj->get_label( 'iw_add' ); ?>
</a>
<?php wp_nonce_field( 'iwpage_' . $id,'iwpage' ); ?>
<div style="clear:both"></div>
<?php
    }
}




