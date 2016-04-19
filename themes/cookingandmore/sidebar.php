<div id="sidebar">
	<div class="book-release-countainer">
		<a href="http://www.amazon.com/gp/product/0807411108/ref=as_li_tf_tl?ie=UTF8&tag=tinawassersco-20&linkCode=as2&camp=217145&creative=399377&creativeASIN=0807411108" target="_blank"><h3 class="white" style="height:50px; text-align:center;"><center>Purchase Tina's Books Here</center></h3></a>
		<a href="#" class="control control_next">&gt;</a>
		<a href="#" class="control control_prev">&lt;</a>
		<ul>
			<li class="current">
				<a href="http://www.amazon.com/gp/product/0807413437/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0807413437&linkCode=as2&tag=tinawassersco-20&linkId=GJ6XAICFCDZ5JPRE" target="_blank"><img src="http://www.cookingandmore.com/wp-content/uploads/2013/10/Frontcover450px1.jpg" alt="Entree to Judaism for Families"  /></a>
				<div class="quote">
                	<p>Entr&eacute;e to Judaism for Families is a great way to get your kids in the kitchen with you, to not only teach them culinary skills, but valuable lessons about Judaism<br/>-Toby Amidor Nutrition</p>
                </div>
			</li>
			<li>
				<a href="http://www.amazon.com/gp/product/0807411108/ref=as_li_tf_tl?ie=UTF8&tag=tinawassersco-20&linkCode=as2&camp=217145&creative=399377&creativeASIN=0807411108" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/images/entree-to-judaism-cover-small.jpg" alt="Entree to Judaism - A Culinary Exploration of the Jewish Diaspora" /></a>
				<div class="quote">
                	<p>A delicious tour de force... <strong>Entr&eacute;e to Judaism</strong> is a treasure for us all.<br /> - Joan Nathan</p>
                </div>
			</li>
			<li>
				<a href="http://www.amazon.com/gp/product/B00LFX3QUW/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00LFX3QUW&linkCode=as2&tag=tinawassersco-20&linkId=VTJVIZIWDF3N55FF" target="_blank"><img src="http://www.cookingandmore.com/wp-content/themes/cookingandmore/images/kindleversion.jpg" alt="Entree to Judaism for Families" style="width:98%;" /></a>
				<div class="quote">
                	<p><strong>eBook</strong><br/><br/>"The amazing part of this cookbook is that it has an 'interactive digital option'... click on a word and images of that cooking tool or an instructional video will pop up.  It's like having a nana or bubbe right there with you in the kitchen."<br/> - Louise at An Apple a Day Nutrition Consulting</p>
                </div>
			</li>
		</ul>
	</div>
	<div class="cam-widget">
                <h3 class="white">Reviews</h3>
                <ul>
                	<?php 
                	ob_start();
                	$args=array(
                		'category_name'=>'Reviews',
						'orderby'=>'date',
						'order'=>'asc',
						'post_status'=>'publish',
						'posts_per_page'=>5
                	);
                	$reviews=query_posts($args);
					foreach($reviews as $review){
						echo '<li><a href="'.get_permalink($review->ID).'">'.$review->post_title.'</a></li>';
					}
                	wp_reset_query();
                	$_reviews=ob_get_contents();
                	ob_clean();
                	echo $_reviews;
                	?>
                </ul>
            </div>
<script>
jQuery(document).ready(function($){
	$('.book-release-countainer a.control').hide();
	$('.book-release-countainer').hover(function(){
		$('.book-release-countainer a.control').fadeIn();
	},function(){
		$('.book-release-countainer a.control').fadeOut();
	});
	$('.book-release-countainer a.control').click(function(e){
		e.preventDefault();
		if($(this).attr('class').replace('control control_','')=='next'){
			var curr=$('.book-release-countainer ul li.current').next();
			if(!curr[0]){
				curr=$('.book-release-countainer ul li').first();
			}
		}else{
			var curr=$('.book-release-countainer ul li.current').prev();
			if(!curr[0]){
				curr=$('.book-release-countainer ul li').last();
			}
		}
		$('.book-release-countainer ul li').hide().removeClass('current');
		$(curr).addClass('current').hide().fadeIn();
	});
	setInterval(function(){
		$('.book-release-countainer a.control_next').trigger('click');
	},10000);
});
</script>
	<!-- <div id="book-release">
                <a href="http://www.amazon.com/gp/product/0807411108/ref=as_li_tf_tl?ie=UTF8&tag=tinawassersco-20&linkCode=as2&camp=217145&creative=399377&creativeASIN=0807411108" target="_blank"><h3>Purchase</h3></a>
                <a href="http://urjbooksandmusic.com/product.php?productid=13056&cat=0&page=1&featured" target="_blank"><img src="http://www.cookingandmore.com/wp-content/uploads/2013/10/Frontcover450px1.jpg" alt="Entree to Judaism for Families"  /></a>
            </div>
            <div class="quote">
                <p>Entree to Judaism for Families: Jewish Cooking and Kitchen Conversations with Children.
             </p>
            </div>


	    <div id="book-release">
                <a href="http://www.amazon.com/gp/product/0807411108/ref=as_li_tf_tl?ie=UTF8&tag=tinawassersco-20&linkCode=as2&camp=217145&creative=399377&creativeASIN=0807411108" target="_blank"><h3>Book Release</h3></a>
                <a href="http://www.amazon.com/gp/product/0807411108/ref=as_li_tf_tl?ie=UTF8&tag=tinawassersco-20&linkCode=as2&camp=217145&creative=399377&creativeASIN=0807411108" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/images/entree-to-judaism-cover-small.jpg" alt="Entree to Judaism - A Culinary Exploration of the Jewish Diaspora" /></a>
            </div>
            <div class="quote">
                <p>A delicious tour de force... <strong>Entree to Judaism</strong> is a treasure for us all.<br />
                - Joan Nathan</p>
            </div> -->
         <!--   <div id="magazine-articles">
                <a href="<?php echo get_permalink(13); ?>"><h3>Magazine Articles</h3></a>
                <a href="http://reformjudaismmag.org/Articles/index.cfm?id=2973" alt="Reform Judaism magazine" target="_blank"/><img src="http://www.cookingandmore.com/wp-content/uploads/2013/02/cover-love.jpg"></a>
            </div>
            <div class="quote">
                <p>I want to thank you for all of your wonderful work that you do.  I teach Jewish cultural cooking in south Fl.  I have used your writing many times in my classrooms.<br />
                - Anna</p>
            </div>-->
	</div>
	