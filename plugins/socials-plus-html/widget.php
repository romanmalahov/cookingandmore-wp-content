<?php 

class Socials_Plus_Html_Widget extends WP_Widget{
	
	public function __construct(){
		parent::__construct('sph_widget',__('Socials + HTML'),array(
			'description'=>__('Facebook and Twitter icons with custom HTML below')
		));
	}
	
	public function widget($args,$instance){
		$html='';
		if(isset($instance['title'])&&trim($instance['title'])!=''){
			$html.='<h3 class="no_img">'.trim($instance['title']).'</h3>';
		}
		$html.='<div class="social-icons-in-sb">';
		if(isset($instance['facebook'])&&trim($instance['facebook'])!=''){
			$html.='<a href="'.trim($instance['facebook']).'" target="_blank">';
			$html.='<img src="'.plugins_url('images/facebook.png',dirname(__FILE__).'/socials-plus-html.php').'" alt="facebook" class="facebook">';
			$html.='</a>';
		}
		if(isset($instance['twitter'])&&trim($instance['twitter'])!=''){
			$html.='<a href="'.trim($instance['twitter']).'" target="_blank">';
			$html.='<img src="'.plugins_url('images/twitter.png',dirname(__FILE__).'/socials-plus-html.php').'" alt="twitter" class="twitter">';
			$html.='</a>';
		}
		$html.='</div>';
		if(isset($instance['html'])&&trim($instance['html'])!=''){
			$html.='<div class="clearfix">';
			$html.=trim($instance['html']);
			$html.='</div>';
		}
		echo $html;
	}
	
	public function update($new_instance,$old_instance){
		return $new_instance;
	}
	
	public function form($instance){
		$title=(isset($instance['title']))?$instance['title']:'';
		$facebook=(isset($instance['facebook']))?$instance['facebook']:'';
		$twitter=(isset($instance['twitter']))?$instance['twitter']:'';
		$html=(isset($instance['html']))?$instance['html']:'';
		$form='<p><label for="'.$this->get_field_id('title').'">'.__('Title:').'</label><input class="widefat" id="'.$this->get_field_id('title').'" name="'.$this->get_field_name('title').'" type="text" value="'.esc_attr($title).'" /></p>';
		$form.='<p><label for="'.$this->get_field_id('facebook').'">'.__('Facebook URL:').'</label><input class="widefat" id="'.$this->get_field_id('facebook').'" name="'.$this->get_field_name('facebook').'" type="text" value="'.esc_attr($facebook).'" /></p>';
		$form.='<p><label for="'.$this->get_field_id('twitter').'">'.__('Twitter URL:').'</label><input class="widefat" id="'.$this->get_field_id('twitter').'" name="'.$this->get_field_name('twitter').'" type="text" value="'.esc_attr($twitter).'" /></p>';
		$form.='<p><label for="'.$this->get_field_id('html').'">'.__('Custom HTML:').'</label><textarea class="widefat" id="'.$this->get_field_id('html').'" name="'.$this->get_field_name('html').'">'.esc_attr($html).'</textarea></p>';
		echo $form;
	}
}