	<div id="sidebar2">
		<?php if(dynamic_sidebar('sidebar-special')): ?>
		
		<?php endif; ?>
		<!-- <div class="social-icons-in-sb">
		<a href="https://www.facebook.com/pages/Tina-Wasserman-Cooking-and-More/136471836426734" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/images/facebook.png" alt="facebook" class="facebook"/></a>
<a href="https://twitter.com/TinaWasserman" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/images/twitter.png" alt="twitter" class="twitter"/></a>
		</div>-->
		<div class="clear"></div>
            <h3 class="no_img">Create a Meal</h3>
            <ul id="recipe_categories">
                <li class="cat-item cat-item-19 current-cat"><a href="<?php echo get_option('home'); ?>/?cat=19&orderby=title&order=ASC" title="View all posts filed under Appetizers">Appetizers</a></li>
                <li class="cat-item cat-item-20"><a href="<?php echo get_option('home'); ?>/?cat=20&orderby=title&order=ASC" title="View all posts filed under Soups &amp; Salads">Soups &amp; Salads</a></li>
                <li class="cat-item cat-item-21"><a href="<?php echo get_option('home'); ?>/?cat=21&orderby=title&order=ASC" title="View all posts filed under Main Courses">Main Courses</a></li>
                <li class="cat-item cat-item-22"><a href="<?php echo get_option('home'); ?>/?cat=22&orderby=title&order=ASC" title="View all posts filed under Side Dishes">Side Dishes</a></li>
                <li class="cat-item cat-item-111"><a href="<?php echo get_option('home'); ?>/?cat=111&orderby=title&order=ASC" title="View all posts filed under Breads">Breads</a></li>
                <li class="cat-item cat-item-119"><a href="<?php echo get_option('home'); ?>/?cat=119&orderby=title&order=ASC" title="View all posts filed under Desserts">Desserts</a></li>
                <li class="cat-item cat-item-24"><a href="<?php echo get_option('home'); ?>/?cat=24&orderby=title&order=ASC" title="View all posts filed under Condiments and Sweets">Condiments &amp; Sweets</a></li>
            </ul>
            
            <div id="featured-recipe" style="min-height:120px;">
				<?php 
				ob_start();
				$featured=new WP_Query(array(
					'post_type'=>'post',
					'showposts'=>1,
					'featured'=>'yes'
				));
				/*$featured=query_posts(array(
					'posts_per_page'=>1,
					'orderby'=>'post_date',
					'meta_key'=>'featured_product',
					'meta_compare'=>'=',
					'meta_value'=>1
				));*/
				$featured=$featured->posts;
				//$featured=array(0=>get_post(682));//query_posts($args);
				if(isset($featured[0])&&is_object($featured[0])){
					if(get_the_post_thumbnail($featured[0]->ID)==''){
						$output=preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i',$featured[0]->post_content,$matches);
						$img_url=$matches[1][0];
					}
					echo '<a href="'.get_permalink($featured[0]->ID).'"><h3>Featured Recipe</h3></a>';
					echo '<a href="'.$img_url.'"><img class="alignright size-thumbnail wp-image-810" alt="'.$featured[0]->post_title.'" src="'.$img_url.'" width="100" height="100" /></a><BR>';
					echo '<a href="'.get_permalink($featured[0]->ID).'">'.$featured[0]->post_title.'</a>';
				}
				wp_reset_query();
				$_features=ob_get_contents();
				ob_clean();
				echo $_features;
				?>
			</div>
			<!-- <div id="featured-recipe">
                <a href="<?php //echo get_permalink(271); ?>"><h3>Featured Recipe</h3></a>
               <a href="http://www.cookingandmore.com/wp-content/uploads/2014/07/Kale-Salad.jpg"><img class="alignright size-thumbnail wp-image-810" alt="Kale Salad" src="http://www.cookingandmore.com/wp-content/uploads/2014/07/Kale-Salad-150x150.jpg" width="100" height="100" /></a><BR>
                <a href="http://www.cookingandmore.com/kale-mango-and-almond-salad-with-honey-ginger-dressing/">Kale, Mango, and Almond Salad with Honey Ginger Dressing</a>
            </div>-->
            <div class="cam-widget">
                <h3 class="green">Recent Posts</h3>
                <ul>
                	<?php 
                	ob_start();
                	$args=array(
						'orderby'=>'date',
						'order'=>'asc',
						'post_status'=>'publish',
						'posts_per_page'=>3
                	);
                	$_posts=query_posts($args);
					foreach($_posts as $_post){
						echo '<li><a href="'.get_permalink($_post->ID).'">'.$_post->post_title.'</a></li>';
					}
                	wp_reset_query();
                	$_recent=ob_get_contents();
                	ob_clean();
                	echo $_recent;
                	?>
                    <!-- <li><a href="http://www.icebase.com/r.pl?6zXUaNTz8dseDmnv_f63a1dd98b16a3e8" target="_blank">My Advice is Fishy</a></li>
                    <li><a href="http://www.icebase.com/r.pl?PyVyXSc5ajTgII6B_b9087cbb0b040ddd" target="blank">May Your Year be Sweet and Fruitful</a></li>  
                    <li><a href="http://www.icebase.com/r.pl?lv0yRPHTkZ1bvNqK_b20f9e87a969bef8" target="_blank">Mother's Day High Tea</a></li>
                    <li><a href="http://www.icebase.com/r.pl?WXDifHjA6dtRDcMN_b62457756c073865" target="_blank">After the Seder Put Leftovers to Good Use</a></li>
                    <li><a href="http://www.icebase.com/r.pl?Ml4erCMo9gzpZMZo_2fc3929c680b8967" target="_blank">Breakfast for Your Valentine of all Ages</a></li>-->
                </ul>
            </div>
            <div class="cam-widget">
                <h3 class="green">Recent Comments</h3>
                <ul>
                	<?php 
                	ob_start();
                	$args=array(
						'orderby'=>'comment_date_gmt',
						'order'=>'asc',
						'status'=>'approve',
						'number'=>3
                	);
                	$_comments=get_comments($args);
					foreach($_comments as $_comment){
						echo '<li><a href="'.get_permalink($_comment->comment_post_ID).'">'.$_comment->comment_author.': <em>'.substr($_comment->comment_content,0,40).'...</em></a></li>';
					}
                	wp_reset_query();
                	$__comments=ob_get_contents();
                	ob_clean();
                	echo $__comments;
                	?>
                </ul>
            </div>
	</div>
