/********************************************************************************************/
/********************************************************************************************/
/*                                  init                                                    */
/********************************************************************************************/
/********************************************************************************************/

var now=new Date();
var timeout=new Date(now.getTime()+3*86400000);

var val=readcookie();
//last=30
if( !val || !(val.length==35) )	{
		document.cookie="cformsshowui=11111111111111111111111111111111111;expires="+timeout.toGMTString()+";";
}

var cforms = jQuery.noConflict();

cforms(document).ready(

	function () {

		/* INFO BUTTONS */
		cforms('.infotxt').css({display:'none'});
		cforms('a.infobutton').css({display:'inline'});
		cforms('a.infobutton').click(function(){ if ( cforms('#'+this.name).css('display')=='none' ) cforms('#'+this.name).css({display:''}); else cforms('#'+this.name).css({display:'none'}); return false; });


		/* GLOBAL VARIABLES */
		var hasht, groupcount, totalcount;

		/* MODIFY THE OK BUTTON CLICK EVENT */
		cforms('a#ok').click(function() {

			if ( (l_label=cforms('#cf_edit_label').val()) == null) l_label='';
			if ( (l_label_group=cforms('#cf_edit_label_group').val()) == null) l_label_group='';
			if ( (l_label_select=cforms('#cf_edit_label_select').val()) == null) l_label_select='';
			if ( (l_left=cforms('#cf_edit_label_left').val()) == null) l_left='';

			line = l_left + l_label + l_label_group + l_label_select;

			if ( (l_css=cforms('#cf_edit_css').val()) == null) l_css=''; else l_css='|'+l_css;
			if ( (l_style=cforms('#cf_edit_style').val()) == null) l_style=''; else l_style='|'+l_style;

			line += l_css + l_style;

			if ( (l_default=cforms('#cf_edit_default').val()) == null) l_default=''; else l_default='|'+l_default;
			if ( (l_regexp=cforms('#cf_edit_regexp').val()) == null) l_regexp=''; else l_regexp='|'+l_regexp;

			line += l_default + l_regexp;

			if ( (l_right=cforms('#cf_edit_label_right').val()) == null) l_right=''; else l_right='#'+l_right;

			line += l_right;

			if ( (l_chkstate=cforms('#cf_edit_checked').attr('checked')) != true) l_chkstate=''; else { if (l_chkstate) l_chkstate='|set:true'; }

			if ( (l_title=cforms('#cf_edit_title').val()) == null) l_title=''; else { if (l_title!='') l_title='|title:'+l_title; }

			if ( (l_cerr=cforms('#cf_edit_customerr').val()) == null) l_cerr=''; else { if (l_cerr!='') l_cerr='|err:'+l_cerr; }

			temp='';
			cforms('.cf_edit_group_new').each( function (index, domEle) {
				if ( (temp_o=cforms('#cf_edit_group_o'+domEle.id.substr(10)).val()) == null) temp_o=''; else temp_o='#'+temp_o;
				if ( (temp_v=cforms('#cf_edit_group_v'+domEle.id.substr(10)).val()) == null) temp_v=''; else { if (temp_v!='') temp_v='|'+temp_v; }
				if ( (temp_chk=cforms('#cf_edit_group_chked'+domEle.id.substr(10)).attr('checked')) != true) temp_chk=''; else { if (temp_chk) temp_chk='|set:true'; }
				if ( (temp_br=cforms('#cf_edit_group_br'+domEle.id.substr(10)).attr('checked')) != true) temp_br=''; else { if (temp_br) temp_br='#'; }
				line += temp_o + temp_v + temp_chk + temp_br;

			} );

			hasht.parentNode.previousSibling.value = line + l_chkstate + l_title + l_cerr;
			return false;
		});

		/* LAUNCHED AFTER AJAX */
		var load = function()	{

			/* GET CURRENT CONFIG */
			line = hasht.parentNode.previousSibling.value;

			if ( document.getElementById('cf_edit_customerr') ){
				content = line.split('|err:');
				cforms('#cf_edit_customerr').val( content[1] );
				line = content[0];
			}

			if ( document.getElementById('cf_edit_title') ){
				content = line.split('|title:');
				cforms('#cf_edit_title').val( content[1] );
				line = content[0];
			}

			if ( document.getElementById('cf_edit_checked') ){
				content = line.split('|set:');
				if( content[1] != undefined && content[1].match(/true/) )
					cforms('#cf_edit_checked').attr( 'checked', 'checked' );
				else
					cforms('#cf_edit_checked').attr( 'checked', '' );
				line = content[0];
			}

			if ( document.getElementById('cf_edit_css') ){
				content = line.split('|');
				cforms('#cf_edit_label').val( content[0] );
				cforms('#cf_edit_css').val( content[1] );
				cforms('#cf_edit_style').val( content[2] );
				line = '';
			}
			else if ( document.getElementById('cf_edit_regexp') ){
				var regexpval;
				content = line.split('|');
				cforms('#cf_edit_label').val( content[0] );
				cforms('#cf_edit_default').val( content[1] );
				if ( content[1]==null )
					content[1] = '';
				regexpval = line.substr(content[0].length+content[1].length+2);
				cforms('#cf_edit_regexp').val( regexpval );
				line = '';
			}
			else if ( document.getElementById('cf_edit_label_left') ){
				content = line.split('#');
				cforms('#cf_edit_label_left').val( content[0] );
				cforms('#cf_edit_label_right').val( content[1] );
				line = '';
			}
			else if ( document.getElementById('cf_edit_label_group') ){

				content = line.split('#');
				totalcount = groupcount = 0;

				cforms('a#add_group_button').click(function() {
					groupcount++; totalcount++;
					cforms('<div class="cf_edit_group_new" id="edit_group'+groupcount+'">'+
						'<a href="#" id="rgi_'+groupcount+'" class="cf_edit_minus"></a>'+
						'<input type="text" id="cf_edit_group_o'+groupcount+'" name="cf_edit_group_o'+groupcount+'" value=""/>'+
						'<input type="text" id="cf_edit_group_v'+groupcount+'" name="cf_edit_group_v'+groupcount+'" value="" class="inpOpt"/>'+
						'<input class="allchk cf_chked" type="checkbox" id="cf_edit_group_chked'+groupcount+'" name="cf_edit_group_chked'+groupcount+'"/>'+
						'<input class="allchk cf_br" type="checkbox" id="cf_edit_group_br'+groupcount+'" name="cf_edit_group_br'+groupcount+'" value="lbr"/>'+
						'<a href="javascript:void(0);" class="cf_edit_move_up"></a>'+
						'<a href="javascript:void(0);" class="cf_edit_move_down"></a>'+
					'</div>').appendTo("#cf_edit_groups");

					cforms('a.cf_edit_move_up','#edit_group'+groupcount).bind("click", cfmoveup);
					cforms('a.cf_edit_move_down','#edit_group'+groupcount).bind("click", cfmovedown);

					cforms('#rgi_'+groupcount).bind("click", function(){
						cforms(this).parent().remove();
						totalcount--;
						if ( totalcount <= 5 ) { cforms('#cf_edit_groups').css( { height:"" } ); }
						return false; });

					if ( totalcount > 5 )
						cforms('#cf_edit_groups').css( { height:"9em", overflowY:"auto" } );

					return false;

				 });

				cforms('#cf_edit_label_group').val( content[0] );

				for( i=1 ; i<content.length ; i++ ) {

					if ( content[i]!='' && content[i].indexOf('|set:')!=-1 ){
						tmp = content[i].split('|set:');
						chk = tmp[1].match(/true/) ? ' checked="checked"':'';
						tmp = tmp[0];
					}else{
						tmp = content[i];
						chk='';
					}

					if ( tmp!='' && tmp.indexOf('|')!=-1 )
						defval = tmp.split('|');
					else {
						var defval = new Array(2); // dummy array
						defval[0]=tmp;
						defval[1]='';
					}
					lbr='';
					if ( content[i+1]=='' ){
						lbr    = ' checked="checked"'; //
						i++;
					}
					groupcount++; totalcount++;

					cforms('<div class="cf_edit_group_new" id="edit_group'+groupcount+'">'+
						'<a href="#" id="rgi_'+groupcount+'" class="cf_edit_minus"></a>'+
						'<input type="text" id="cf_edit_group_o'+groupcount+'" name="cf_edit_group_o'+groupcount+'" value="'+defval[0].replace(/"/g,'&quot;')+'"/>'+
						'<input type="text" id="cf_edit_group_v'+groupcount+'" name="cf_edit_group_v'+groupcount+'" value="'+defval[1].replace(/"/g,'&quot;')+'" class="inpOpt"/>'+
						'<input class="allchk cf_chked" type="checkbox" id="cf_edit_group_chked'+groupcount+'" name="cf_edit_group_chked'+groupcount+'" '+chk+'/>'+
						'<input class="allchk cf_br" type="checkbox" id="cf_edit_group_br'+groupcount+'" name="cf_edit_group_br'+groupcount+'" value="lbr" '+lbr+'/>'+
						'<a href="javascript:void(0);" class="cf_edit_move_up"></a>'+
						'<a href="javascript:void(0);" class="cf_edit_move_down"></a>'+
					'</div>').appendTo("#cf_edit_groups");

				}

				if ( groupcount > 5 )
					cforms('#cf_edit_groups').css( { height:"9em", overflowY:"auto" } );

				cforms('.cf_edit_group_new > a.cf_edit_minus').bind("click", function(){ cforms(this).parent().remove(); if ( totalcount-- < 5 ) cforms('#cf_edit_groups').css( { height:"" } ); return false; });

				line = '';

			}
			else if ( document.getElementById('cf_edit_label_select') ){

				content = line.split('#');
				totalcount = groupcount = 0;

				cforms('a#add_group_button').click(function() {
					groupcount++; totalcount++;
					cforms('<div class="cf_edit_group_new" id="edit_group'+groupcount+'">'+
						'<a href="#" id="rgi_'+groupcount+'" class="cf_edit_minus"></a>'+
						'<input type="text" id="cf_edit_group_o'+groupcount+'" name="cf_edit_group_o'+groupcount+'" value=""/>'+
						'<input type="text" id="cf_edit_group_v'+groupcount+'" name="cf_edit_group_v'+groupcount+'" value="" class="inpOpt"/>'+
						'<input class="allchk cf_chked" type="checkbox" id="cf_edit_group_chked'+groupcount+'" name="cf_edit_group_chked'+groupcount+'"/>'+
						'<a href="javascript:void(0);" class="cf_edit_move_up"></a>'+
						'<a href="javascript:void(0);" class="cf_edit_move_down"></a>'+
					'</div>').appendTo("#cf_edit_groups");

					cforms('a.cf_edit_move_up','#edit_group'+groupcount).bind("click", cfmoveup);
					cforms('a.cf_edit_move_down','#edit_group'+groupcount).bind("click", cfmovedown);

					cforms('#rgi_'+groupcount).bind("click", function(){
						cforms(this).parent().remove();
						totalcount--;
						if ( totalcount <= 5 ) { cforms('#cf_edit_groups').css( { height:"" } ); }
						return false; });

					if ( totalcount > 5 )
						cforms('#cf_edit_groups').css( { height:"9em", overflowY:"auto" } );

					return false;

				 });

				cforms('#cf_edit_label_select').val( content[0] );

				for( i=1 ; i<content.length ; i++ ) {

					if ( content[i]!='' && content[i].indexOf('|set:')!=-1 ){
						tmp = content[i].split('|set:');
						chk = tmp[1].match(/true/) ? ' checked="checked"':'';
						tmp = tmp[0];
					}else{
						tmp = content[i];
						chk='';
					}

					if ( tmp!='' && tmp.indexOf('|')!=-1 )
						defval = tmp.split('|');
					else {
						var defval = new Array(2);
						defval[0]=tmp;
						defval[1]='';
					}

					lbr='';
					if ( content[i+1]=='' ){
						lbr    = ' checked="checked"'; //
						i++;
					}
					else {
						groupcount++; totalcount++;
					}

					cforms('<div class="cf_edit_group_new" id="edit_group'+groupcount+'">'+
						'<a href="#" id="rgi_'+groupcount+'" class="cf_edit_minus"></a>'+
						'<input type="text" id="cf_edit_group_o'+groupcount+'" name="cf_edit_group_o'+groupcount+'" value="'+defval[0].replace(/"/g,'&quot;')+'"/>'+
						'<input type="text" id="cf_edit_group_v'+groupcount+'" name="cf_edit_group_v'+groupcount+'" value="'+defval[1].replace(/"/g,'&quot;')+'" class="inpOpt"/>'+

						'<input class="allchk cf_chked" type="checkbox" id="cf_edit_group_chked'+groupcount+'" name="cf_edit_group_chked'+groupcount+'" '+chk+'/>'+

						'<a href="javascript:void(0);" class="cf_edit_move_up"></a>'+
						'<a href="javascript:void(0);" class="cf_edit_move_down"></a>'+
					'</div>').appendTo("#cf_edit_groups");

				}

				if ( groupcount > 5 )
					cforms('#cf_edit_groups').css( { height:"9em", overflowY:"auto" } );

				cforms('.cf_edit_group_new > a.cf_edit_minus').bind("click", function(){ cforms(this).parent().remove(); if ( totalcount-- < 5 ) cforms('#cf_edit_groups').css( { height:"" } ); return false; });

				line = '';

			}
			else if ( document.getElementById('cf_edit_label') )
				cforms('#cf_edit_label').val( line );

		// up click
		cforms('.cf_edit_group_new > a.cf_edit_move_up').bind("click", cfmoveup);
		cforms('.cf_edit_group_new > a.cf_edit_move_down').bind("click", cfmovedown);

		cforms('.cf_ed_main').addClass('ajaxloaded');

		};


		/* ASSOCIATE PROPER POPUP BOX / PHP FILE */
		var files = new Array(	'fieldsetstart',	// fieldsetstart
								'textonly',			// textonly
								'textfield',		// textfield
								'textfield',		// textarea
								'checkbox',			// checkbox
								'checkboxgroup',	// checkboxgroup
								'checkboxgroup',	// radiobuttons
								'selectbox',		// selectbox
								'selectbox',		// multiselectbox
								'textfield',		// upload
								'textfield',		// datepicker
								'textfield',		// pwfield
								'textfield',		// hidden
								'fieldsetstart',	// fieldsetend

								'textfield',		// dummy
								'checkbox',			// ccbox
								'selectbox',		// emailtobox
								'textfield',		// verification
								'textfield',		// captcha

								'textfield',		// dummy
								'textfield',		// yourname
								'textfield',		// youremail
								'textfield',		// friendsname
								'textfield',		// friendsemail

								'textfield',		// dummy
								'textfield',		// cauthor
								'textfield',		// email
								'textfield',		// url
								'textfield',		// comment
								'checkboxgroup',	// send2author
								'checkbox',			// subscribe
								'checkbox');		// comment luv

		/* LAUNCHED BEFORE AJAX */
		var open=function(hash)	{ hash.w.css('opacity',1).show();
								  hasht = hash.t;
								  cforms('#cf_target').load(hash.t.parentNode.title + files[hash.t.parentNode.nextSibling.selectedIndex] + '.php', {limit: 25}, function(){ load(); } );
								};

		/* LAUNCHED WHEN BOX CLOSED */
		var close=function(hash){ cforms('.cf_ed_main').removeClass('ajaxloaded'); hash.w.hide(); cforms('#cf_target').html(''); hash.o.remove(); };

		/* ASSSOCIATE DIALOG */
	  	cforms('#cf_editbox').jqm({ modal: true, overlay: 30, onShow: open, onHide: close }).jqDrag('.jqDrag');

		/* INSTALL PRESET FUNCTIONS */
		cforms('a#okInstall').click( function() { document.installpreset.submit(); } );

		var oldDesc;
		var loadInstall = function() {
				oldDesc=0;
				cforms('select#formpresets').keypress( showDesc );
				cforms('select#formpresets').change( showDesc );
				cforms('.cf_ed_main').addClass('ajaxloaded');
				cforms('select#formpresets').focus();
				};

		var showDesc = function() { cforms('span#descInstall'+oldDesc).toggle(); cforms('span#descInstall'+this.selectedIndex).toggle(); oldDesc=this.selectedIndex; };

		/* LAUNCHED BEFORE AJAX */
		var openInstall=function(hash)	{
				hash.w.css('opacity',1).show();
				hasht = hash.t;
				cforms('#cf_installtarget').load( hash.t.name+'installpreset.php', {limit: 25}, function(){ loadInstall(); } );
				};

		/* LAUNCHED WHEN BOX CLOSED */
		var closeInstall=function(hash){ cforms('span','p#descPreset').hide(); cforms('.cf_ed_main').removeClass('ajaxloaded'); hash.w.hide(); cforms('#cf_installtarget').html(''); hash.o.remove(); };

		/* ASSSOCIATE DIALOG */
	  	cforms('#cf_installbox').jqm({ trigger: '.jqModalInstall', modal: true, overlay: 30, onShow: openInstall, onHide: closeInstall }).jqDrag('.jqDrag');

		/* DELETE RECORDS DIALOG */
		var open_data=function(hash) { hash.w.css('opacity',1).show(); cforms('.cf_ed_main').addClass('ajaxloaded'); };
		var close_data=function(hash){ hash.w.hide(); hash.o.remove(); };
		cforms('#cf_delete_dialog').jqm({ modal: true, overlay: 30, onShow: open_data, onHide: close_data }).jqDrag('.jqDrag');
		cforms('a#okDelete').click( function() {
			var getString='';
			cforms('.trSelected','#flex1').each( function (){ getString = getString + cforms('td:first > div',this).html() + ','} );
			if ( getString=='' )
			 	getString = 'all';
			var query	  = cforms('.qsbox','.sDiv').attr('value');
			var qtype	  = cforms('select','.sDiv').attr('value');
			cforms.post(cforms('#geturl').attr('title')+'lib_database_deleteentries.php', {ids: getString, query: query, qtype: qtype}, function(ret,stat){ cforms('#ctrlmessage').show(); cforms('#ctrlmessage').html(ret); cforms('.pReload').trigger('click'); cforms('#ctrlmessage').fadeOut(5000); } );
			} );

		/* DOWNLOAD RECORDS DIALOG */
		cforms('#cf_dl_dialog').jqm({ modal: true, overlay: 30, onShow: open_data, onHide: close_data }).jqDrag('.jqDrag');
		cforms('a#okDL').click( function() {
			var getString='';
			cforms('.trSelected','#flex1').each( function (){ getString = getString + cforms('td:first > div',this).html() + ','} );
			if ( getString=='' )
			 	getString = 'all';

			var sortBy    = cforms('.sorted','#flex1').attr('abbr');
			var sortOrder = cforms('.sorted > div:first','#flex1').attr('class');
			var query	  = cforms('.qsbox','.sDiv').attr('value');
			var qtype	  = cforms('select','.sDiv').attr('value');
			var format    = cforms('#pickDLformat').attr('value');
			var header    = cforms('#header').attr('checked');
			location.href = cforms('#geturl').attr('title')+'lib_database_dlentries.php?header='+header+'&format='+format+'&ids='+getString+'&sorted='+sortBy+'&sortorder='+sortOrder+'&query='+query+'&qtype='+qtype;
			} );


		/* MAKE FORM FIELDS SORTABLE */
		if	(cforms('.groupWrapper')) {
			cforms('.groupWrapper').Sortable(
				{
					accept: 		'groupItem',
					helperclass:	'sortHelper',
					activeclass : 	'sortableactive',
					hoverclass : 	'sortablehover',
					handle:			'span.itemHeader',
					tolerance:		'pointer',
					opacity:		0.5,
					axis:			'vertically',
					onStop : function()
					{
						serial = cforms.SortSerialize('allfields');
						document.getElementById('cformswarning').style.display = '';
						document.mainform.field_order.value = serial.hash;
					}
				}
			);
		}

		/* TEXTAREAS resize */
        cforms('textarea.resizable:not(.processed)').TextAreaResizer();

		/* MANAGE COOKIES & BLINDS */
		val=readcookie();
		for( i=0 ; i<35 ; i++ ) {
			if ( (document.getElementById('o'+i)) && val.charAt(i)==1 ) {
				document.getElementById('o'+i).style.display = 'none';
			}
			if ( document.getElementById('b'+i) )
				document.getElementById('b'+i).className = (val.charAt(i)==1)?'blindplus':'blindminus';
		}
		if( this.location.href.indexOf('#')>0 )
			this.location.href = this.location.href.substring(this.location.href.indexOf('#'),this.location.href.length);

	}
);

/* global settings captcha reset */
function resetAdminCaptcha (path){

	i = cforms('#cforms_cap_i').val();
	w = cforms('#cforms_cap_w').val();
	h = cforms('#cforms_cap_h').val();
	c = cforms('#inputID2').val();
	l = cforms('#inputID1').val();
	bg= cforms('#cforms_cap_b').val();
	f = cforms('#cforms_cap_f').val();
	fo= cforms('#cforms_cap_fo').val();
	foqa= cforms('#cforms_cap_foqa').val();
	f1= cforms('#cforms_cap_f1').val();
	f2= cforms('#cforms_cap_f2').val();
	a1= cforms('#cforms_cap_a1').val();
	a2= cforms('#cforms_cap_a2').val();
	c1= cforms('#cforms_cap_c1').val();
	c2= cforms('#cforms_cap_c2').val();
	ac= cforms('#cforms_cap_ac').val();

	data = path+"/cforms-captcha.php?ts=0&c1="+c1+"&c2="+c2+"&ac="+ac+"&i="+i+"&w="+w+"&h="+h+"&c="+c+"&l="+l+"&f="+f+"&a1="+a1+"&a2="+a2+"&f1="+f1+"&f2="+f2+"&b="+bg+"&rnd="+Math.round(Math.random()*999999);

	if ( cforms('#cf_captcha_img').length>0 )
	    cforms('#cf_captcha_img').attr('src',data);
	else
	    cforms('#adminCaptcha').prepend('<img id="cf_captcha_img" class="captcha" src="'+data+'" alt=""/>');

    cforms('#pnote').show();
}

// moving dialog box optionsfunction cfmoveup(){
function cfmoveup(){
	prevEl = cforms(this).parent().prev();
	if ( prevEl.attr('id') != undefined )
		prevEl.insertAfter( cforms(this).parent() );
	return false;
}

// moving dialog box options
function cfmovedown(){
	nextEl = cforms(this).parent().next();
	if ( nextEl.attr('id') != undefined )
		nextEl.insertBefore( cforms(this).parent() );
	return false;
}

/* TRACKING RECORDS ROUTINES */
function cf_tracking_view(com,grid){
	var getString='';
	cforms('.trSelected',grid).each( function (){ getString = getString + cforms('td:first > div',this).html() + ','} );
	if ( getString=='' )
	 	getString = 'all';
	var sortBy    = cforms('.sorted',grid).attr('abbr');
	var sortOrder = cforms('.sorted > div:first',grid).attr('class');
	var query	  = cforms('.qsbox','.sDiv').attr('value');
	var qtype	  = cforms('select','.sDiv').attr('value');
	cforms('#entries').load(cforms('#geturl').attr('title')+'lib_database_getentries.php', {showids: getString, sorted: sortBy, sortorder: sortOrder, query: query, qtype: qtype}, function(){ submissions_loaded(); } );
}
function submissions_loaded(){
	cforms('.cdatabutton','#entries').bind("click", close_submission );
	cforms('.xdatabutton','#entries').bind("click", delete_submission );
	cforms(".editable").editable(cforms('#geturl').attr('title')+'lib_database_savedata.php',
		{	type : 'textarea',
			submit : '<div class="divimg"><img src="'+cforms('#geturl').attr('title')+'../css/images/ok.png"></div>',
			indicator : '<img src="'+cforms('#geturl').attr('title')+'../css/images/indicator.gif">',
			placeholder: '<img src="'+cforms('#geturl').attr('title')+'../css/images/edit.png">',
			width: '85%',
			height: 60,
			loadurl: cforms('#geturl').attr('title')+'lib_database_loaddata.php',
			loadtype: 'POST',
			cssclass : "jQeditField" } );

	location.href = '#entries';
}
function delete_submission(){
	eid = this.id.substr(7,this.id.length);
	cforms('#entry'+eid).fadeOut(500, function(){ cforms(this).remove(); } );
	cforms.post(cforms('#geturl').attr('title')+'lib_database_deleteentry.php', {id: eid}, function(){ cforms('.pReload').trigger('click'); } );
	return false;
}
function close_submission(){
	eid = this.id.substr(7,this.id.length);
	cforms('#entry'+eid).fadeOut(500, function(){ cforms(this).remove(); } );
	return false;
}

/********************************************************************************************/
/********************************************************************************************/
/*                                  rest                                                    */
/********************************************************************************************/
/********************************************************************************************/

function checkentry(el) {
  if ( document.getElementById(el).checked == 0 )
	document.getElementById(el).checked = 1;
  else
	document.getElementById(el).checked = 0;
};

function checkonoff(formno,chkName) {
  if ( document.forms[formno].checkflag.value == 0 ) {
    document.forms[formno].checkflag.value =1;
    document.forms[formno].allchktop.checked = 1;
    document.forms[formno].allchkbottom.checked = 1;
    SetChecked (formno,1,chkName);
  }
  else {
    document.forms[formno].checkflag.value =0;
    document.forms[formno].allchktop.checked = 0;
    document.forms[formno].allchkbottom.checked = 0;
    SetChecked (formno,0,chkName);
  }
}

function SetChecked(formno,val,chkName) {
  dml=document.forms[formno];
  len = dml.elements.length;
  var i=0;
  for( i=0 ; i<len ; i++) {
    if (dml.elements[i].name==chkName) {
      dml.elements[i].checked=val;
    }
  }
}

function sort_entries(field) {
	if( document.form.order.value==field ) {
		if ( document.form.orderdir.value=='DESC' )
			document.form.orderdir.value='ASC';
		else
			document.form.orderdir.value='DESC';
	}
	document.form.order.value=field;
	document.form.submit();
}


function toggleui(el) {
	var val=readcookie();
	var c = 'cformsshowui=';
	x = val.charAt(el) ^ 1;
	document.getElementById('b'+el).className = (x)?'blindplus':'blindminus';
	document.getElementById('o'+el).style.display = (x)?'none':'';

	if ( el>0 )	a = val.slice(0,el); else a='';
	if ( el<val.length ) b = val.slice((el+1),val.length); else b='';
	document.cookie=c+a+x+b+";expires="+timeout.toGMTString()+";";
}
function setshow(el) {
	var val=readcookie();
	var c = 'cformsshowui=';
	if ( document.getElementById('b'+el) && document.getElementById('o'+el) && val.charAt(el)==1 ) {
		document.getElementById('b'+el).className = 'blindminus';
		document.getElementById('o'+el).style.display = '';
	}
	if ( el>0 )	a = val.slice(0,el); else a='';
	if ( el<val.length ) b = val.slice((el+1),val.length); else b='';
	document.cookie=c+a+0+b+";expires="+timeout.toGMTString()+";";
	return false;
}
function showui(el) {
	var val=readcookie();
	if( val )
		return val.substr(el,1);
	return false;
}
function readcookie() {
	var nameEQ = "cformsshowui=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ')
			c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length,c.length);
	}
	return null;
}


/********************************************************************************************/
/********************************************************************************************/
/*                                  POPUP DIALOG                                            */
/********************************************************************************************/
/********************************************************************************************/

(function(cforms) {
cforms.fn.jqm=function(o){
var p={
overlay: 50,
overlayClass: 'jqmOverlay',
closeClass: 'jqmClose',
trigger: '.jqModal',
ajax: F,
ajaxText: '',
target: F,
modal: F,
toTop: F,
onShow: F,
onHide: F,
onLoad: F
};
return this.each(function(){if(this._jqm)return H[this._jqm].c=cforms.extend({},H[this._jqm].c,o);s++;this._jqm=s;
H[s]={c:cforms.extend(p,cforms.jqm.params,o),a:F,w:cforms(this).addClass('jqmID'+s),s:s};
if(p.trigger)cforms(this).jqmAddTrigger(p.trigger);
});};

cforms.fn.jqmAddClose=function(e){return hs(this,e,'jqmHide');};
cforms.fn.jqmAddTrigger=function(e){return hs(this,e,'jqmShow');};
cforms.fn.jqmShow=function(t){return this.each(function(){cforms.jqm.open(this._jqm,t);});};
cforms.fn.jqmHide=function(t){return this.each(function(){cforms.jqm.close(this._jqm,t)});};

cforms.jqm = {
hash:{},
open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(parseInt(h.w.css('z-index'))),z=(z>0)?z:3000,o=cforms('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100});if(h.a)return F;h.t=t;h.a=true;h.w.css('z-index',z);
 if(c.modal) {if(!A[0])L('bind');A.push(s);}
 else if(c.overlay > 0)h.w.jqmAddClose(o);
 else o=F;

 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):F;
 if(ie6){cforms('html,body').css({height:'100%',width:'100%'});if(o){o=o.css({position:'absolute'})[0];for(var y in {Top:1,Left:1})o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");}}

 if(c.ajax) {var r=c.target||h.w,u=c.ajax,r=(typeof r == 'string')?cforms(r,h.w):cforms(r),u=(u.substr(0,1) == '@')?cforms(t).attr(u.substring(1)):u;
  r.html(c.ajaxText).load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose(cforms(cc,h.w));e(h);});}
 else if(cc)h.w.jqmAddClose(cforms(cc,h.w));

 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);
 (c.onShow)?c.onShow(h):h.w.show();e(h);return F;
},
close:function(s){var h=H[s];if(!h.a)return F;h.a=F;
 if(A[0]){A.pop();if(!A[0])L('unbind');}
 if(h.c.toTop&&h.o)cforms('#jqmP'+h.w[0]._jqm).after(h.w).remove();
 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return F;
},
params:{}};
var s=0,H=cforms.jqm.hash,A=[],ie6=cforms.browser.msie&&(cforms.browser.version == "6.0"),F=false,
i=cforms('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0}),
e=function(h){if(ie6)if(h.o)h.o.html('<p style="width:100%;height:100%"/>').prepend(i);else if(!cforms('iframe.jqm',h.w)[0])h.w.prepend(i); f(h);},
f=function(h){try{cforms(':input:visible',h.w)[0].focus();}catch(_){}},
L=function(t){cforms()[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
m=function(e){var h=H[A[A.length-1]],r=(!cforms(e.target).parents('.jqmID'+h.s)[0]);if(r)f(h);return !r;},
hs=function(w,t,c){return w.each(function(){var s=this._jqm;cforms(t).each(function() {
 if(!this[c]){this[c]=[];cforms(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return F;});}this[c].push(s);});});};
})(cforms);

(function(cforms){
cforms.fn.jqDrag=function(h){return i(this,h,'d');};
cforms.fn.jqResize=function(h){return i(this,h,'r');};
cforms.jqDnR={dnr:{},e:0,
drag:function(v){
 if(M.k == 'd')E.css({left:M.X+v.pageX-M.pX,top:M.Y+v.pageY-M.pY});
 else E.css({width:Math.max(v.pageX-M.pX+M.W,0),height:Math.max(v.pageY-M.pY+M.H,0)});
  return false;},
stop:function(){E.css('opacity',M.o);cforms().unbind('mousemove',J.drag).unbind('mouseup',J.stop);}
};
var J=cforms.jqDnR,M=J.dnr,E=J.e,
i=function(e,h,k){return e.each(function(){h=(h)?cforms(h,e):e;
 h.bind('mousedown',{e:e,k:k},function(v){var d=v.data,p={};E=d.e;
 // attempt utilization of dimensions plugin to fix IE issues
 if(E.css('position') != 'relative'){try{E.position(p);}catch(e){}}
 M={X:p.left||f('left')||0,Y:p.top||f('top')||0,W:f('width')||E[0].scrollWidth||0,H:f('height')||E[0].scrollHeight||0,pX:v.pageX,pY:v.pageY,k:d.k,o:E.css('opacity')};
 E.css({opacity:0.8});cforms().mousemove(cforms.jqDnR.drag).mouseup(cforms.jqDnR.stop);
 return false;
 });
});},
f=function(k){return parseInt(E.css(k))||false;};
})(jQuery);

/********************************************************************************************/
/********************************************************************************************/
/*                                  Color Picker                                            */
/********************************************************************************************/
/********************************************************************************************/

function $cf(v) { return(document.getElementById(v)); }
function $cfS(v) { return(document.getElementById(v).style); }
function absPos(e) { var r={x:e.offsetLeft,y:e.offsetTop}; if(e.offsetParent) { var v=absPos(e.offsetParent); r.x+=v.x; r.y+=v.y; } return(r); }
function agent(v) { return(Math.max(navigator.userAgent.toLowerCase().indexOf(v),0)); }
function isset(v) { return((typeof(v)=='undefined' || v.length==0)?false:true); }
function toggle(i,t,xy) { var v=$cfS(i); v.display=t?t:(v.display=='none'?'block':'none'); if(xy) { v.left=xy[0]; v.top=xy[1]; } }
function XY(e,v) {

	if (agent('msie') && document.documentElement && document.documentElement.scrollTop){
		theTop = document.documentElement.scrollTop;
		theLeft = document.documentElement.scrollLeft;
	}else if (agent('msie') && document.body){
		theTop = document.body.scrollTop;
		theLeft = document.body.scrollLeft;
	}

	if ( agent('msie') ){
		var z=Array(event.clientX+theLeft-8,event.clientY+theTop-15);
	} else if ( agent('pera') ){
 		var z=Array(e.pageX+1,e.pageY-4);
 	}
	else //FF
 		var z=Array(e.pageX-13,e.pageY-19);

	return (v==3?z:z[zero(v)]);

}
//function XYwin(v) { var z=agent('msie')?[document.body.clientHeight,document.body.clientWidth]:[window.innerHeight,window.innerWidth]; return(!isNaN(v)?z[v]:z); }
function zero(v) { v=parseInt(v); return(!isNaN(v)?v:0); }
function zindex(d) { d.style.zIndex=zINDEX++; }

var stop=1;

function cords(W) {

	var W2=W/2, rad=(hsv[0]/360)*(Math.PI*2), hyp=(hsv[1]+(100-hsv[2]))/100*(W2/2);

	$cfS('mCur').left=Math.round(Math.abs(Math.round(Math.sin(rad)*hyp)+W2+3))+'px';
	$cfS('mCur').top=Math.round(Math.abs(Math.round(Math.cos(rad)*hyp)-W2-21))+'px';

}

function coreXY(o,e,xy,z,fu) {

	function point(a,b,e) { eZ=XY(e,3); commit([eZ[0]+a,eZ[1]+b]); }
	function M(v,a,z) { return(Math.max(!isNaN(z)?z:0,!isNaN(a)?Math.min(a,v):v)); }

	function commit(v) { if(fu) fu(v);

		if(o=='mCur') { var W=parseInt($cfS('mSpec').width), W2=W/2, W3=W2/2;

			var x=v[0]-W2-3, y=W-v[1]-W2+15, SV=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)), hue=Math.atan2(x,y)/(Math.PI*2);

			hsv=[hue>0?(hue*360):((hue*360)+360), SV<W3?(SV/W3)*100:100, SV>=W3?Math.max(0,1-((SV-W3)/(W2-W3)))*100:100];

			//$cf('mHEX').innerHTML=hsv2hex(hsv);
			$cfS('plugID'+currentEL).backgroundColor='#'+hsv2hex(hsv);
			cords(W);
			$cf('inputID'+currentEL).value=hsv2hex(hsv);

		}
		else if(o=='mSize') { var b=Math.max(Math.max(v[0],v[1])+oH,75); cords(b);

			$cfS('mini').height=(b+28)+'px';
			$cfS('mini').width=(b+20)+'px';
			$cfS('mSpec').height=b+'px';
			$cfS('mSpec').width=b+'px';

		}
		else {

			if(xy) v=[M(v[0],xy[0],xy[2]), M(v[1],xy[1],xy[3])]; // XY LIMIT

			if(!xy || xy[0]) d.left=v[0]+'px';
			if(!xy || xy[1]) d.top=v[1]+'px';

		}
	}

	if(stop) { stop=''; var d=$cfS(o), eZ=XY(e,3); if(!z) zindex($cf(o));

		if(o=='mCur') { var ab=absPos($cf(o).parentNode); point(-(ab['x']-5),-(ab['y']-28),e); }

		if(o=='mSize') { var oH=parseInt($cfS('mSpec').height), oX=-XY(e), oY=-XY(e,1); } else { var oX=parseInt(d.left)-eZ[0], oY=parseInt(d.top)-eZ[1]; }

		document.onmousemove=function(e){ if(!stop) point(oX,oY-7,e); };
		document.onmouseup=function(){ stop=1; document.onmousemove=''; document.onmouseup=''; };

	}
}

/* CONVERSIONS */

function toHex(v) { v=Math.round(Math.min(Math.max(0,v),255)); return("0123456789ABCDEF".charAt((v-v%16)/16)+"0123456789ABCDEF".charAt(v%16)); }
function rgb2hex(r) { return(toHex(r[0])+toHex(r[1])+toHex(r[2])); }
function hsv2hex(h) { return(rgb2hex(hsv2rgb(h))); }

function hsv2rgb(r) { // easyrgb.com/math.php?MATH=M21#text21

    var R,B,G,S=r[1]/100,V=r[2]/100,H=r[0]/360;

    if(S>0) { if(H>=1) H=0;

        H=6*H; F=H-Math.floor(H);
        A=Math.round(255*V*(1.0-S));
        B=Math.round(255*V*(1.0-(S*F)));
        C=Math.round(255*V*(1.0-(S*(1.0-F))));
        V=Math.round(255*V);

        switch(Math.floor(H)) {

            case 0: R=V; G=C; B=A; break;
            case 1: R=B; G=V; B=A; break;
            case 2: R=A; G=V; B=C; break;
            case 3: R=A; G=B; B=V; break;
            case 4: R=C; G=A; B=V; break;
            case 5: R=V; G=A; B=B; break;

        }

        return([R?R:0,G?G:0,B?B:0]);

    }
    else return([(V=Math.round(V*255)),V,V]);

}

/* GLOBALS */

var zINDEX=1000, hsv=[0,0,100], currentEL=1;


/*
 * Flexigrid for jQuery - New Wave Grid
 *
 * Copyright (c) 2008 Paulo P. Marinas (webplicity.net/flexigrid)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-04-01 00:09:43 +0800 (Tue, 01 Apr 2008) $
 */

(function($){

	$.addFlex = function(t,p)
	{

		if (t.grid) return false; //return if already exist

		// apply default properties
		p = $.extend({
			 height: 200, //default height
			 width: 'auto', //auto width
			 striped: true, //apply odd even stripes
			 novstripe: false,
			 minwidth: 30, //min width of columns
			 minheight: 100, //min height of columns
			 resizable: true, //resizable table
			 url: false, //ajax url
			 method: 'POST', // data sending method
			 dataType: 'xml', // type of data loaded
			 errormsg: 'Connection Error',
			 usepager: false, //
			 nowrap: true, //
			 page: 1, //current page
			 total: 1, //total pages
			 useRp: true, //use the results per page select box
			 rp: 15, // results per page
			 rpOptions: [10,15,20,25,40],
			 title: false,
			 pagestat: 'Displaying {from} to {to} of {total} items',
			 procmsg: 'Processing, please wait ...',
			 query: '',
			 qtype: '',
			 nomsg: 'No items',
			 minColToggle: 1, //minimum allowed column to be hidden
			 showToggleBtn: true, //show or hide column toggle popup
			 hideOnSubmit: true,
			 autoload: true,
			 blockOpacity: 0.5,
			 onToggleCol: false,
			 onChangeSort: false,
			 onSuccess: false,
			 onSubmit: false // using a custom populate function
		  }, p);


		$(t)
		.show() //show if hidden
		.attr({cellPadding: 0, cellSpacing: 0, border: 0})  //remove padding and spacing
		.removeAttr('width') //remove width properties
		;

		//create grid class
		var g = {
			hset : {},
			rePosDrag: function () {

			var cdleft = 0 - this.hDiv.scrollLeft;
			if (this.hDiv.scrollLeft>0) cdleft -= Math.floor(p.cgwidth/2);
			$(g.cDrag).css({top:g.hDiv.offsetTop+1});
			var cdpad = this.cdpad;

			$('div',g.cDrag).hide();

			$('thead tr:first th:visible',this.hDiv).each
				(
			 	function ()
					{
					var n = $('thead tr:first th:visible',g.hDiv).index(this);

					var cdpos = parseInt($('div',this).width());
					var ppos = cdpos;
					if (cdleft==0)
							cdleft -= Math.floor(p.cgwidth/2);

					cdpos = cdpos + cdleft + cdpad;

					$('div:eq('+n+')',g.cDrag).css({'left':cdpos+'px'}).show();

					cdleft = cdpos;
					}
				);

			},
			fixHeight: function (newH) {

					if (!newH) newH = $(g.bDiv).height();
					var hdHeight = $(this.hDiv).height();
					$('div',this.cDrag).each(
						function ()
							{
								$(this).height(newH+hdHeight);
							}
					);
					$(g.block).css({height:newH,marginBottom:(newH * -1)});

					var hrH = g.bDiv.offsetTop + newH;
					if (p.height != 'auto' && p.resizable) hrH = g.vDiv.offsetTop;
					$(g.rDiv).css({height: hrH});

			},
			dragStart: function (dragtype,e,obj) { //default drag function start

				if (dragtype=='colresize') //column resize
					{
						$(g.nDiv).hide();$(g.nBtn).hide();
						var n = $('div',this.cDrag).index(obj);
						var ow = $('th:visible div:eq('+n+')',this.hDiv).width();
						$(obj).addClass('dragging').siblings().hide();
						$(obj).prev().addClass('dragging').show();

						this.colresize = {startX: e.pageX, ol: parseInt(obj.style.left), ow: ow, n : n };
						$('body').css('cursor','col-resize');
					}
				else if (dragtype=='vresize') //table resize
					{
						var hgo = false;
						$('body').css('cursor','row-resize');
						if (obj)
							{
							hgo = true;
							$('body').css('cursor','col-resize');
							}
						this.vresize = {h: p.height, sy: e.pageY, w: p.width, sx: e.pageX, hgo: hgo};

					}
				else if (dragtype=='colMove') //column header drag
					{
						$(g.nDiv).hide();$(g.nBtn).hide();
						this.hset = $(this.hDiv).offset();
						this.hset.right = this.hset.left + $('table',this.hDiv).width();
						this.hset.bottom = this.hset.top + $('table',this.hDiv).height();
						this.dcol = obj;
						this.dcoln = $('th',this.hDiv).index(obj);

						this.colCopy = document.createElement("div");
						this.colCopy.className = "colCopy";
						this.colCopy.innerHTML = obj.innerHTML;
						if ($.browser.msie)
						{
						this.colCopy.className = "colCopy ie";
						}


						$(this.colCopy).css({position:'absolute',float:'left',display:'none', textAlign: obj.align});
						$('body').append(this.colCopy);
						$(this.cDrag).hide();

					}

				$('body').noSelect();

			},
			dragMove: function (e) {

				if (this.colresize) //column resize
					{
						var n = this.colresize.n;
						var diff = e.pageX-this.colresize.startX;
						var nleft = this.colresize.ol + diff;
						var nw = this.colresize.ow + diff;
						if (nw > p.minwidth)
							{
								$('div:eq('+n+')',this.cDrag).css('left',nleft);
								this.colresize.nw = nw;
							}
					}
				else if (this.vresize) //table resize
					{
						var v = this.vresize;
						var y = e.pageY;
						var diff = y-v.sy;

						if (!p.defwidth) p.defwidth = p.width;

						if (p.width != 'auto' && !p.nohresize && v.hgo)
						{
							var x = e.pageX;
							var xdiff = x - v.sx;
							var newW = v.w + xdiff;
							if (newW > p.defwidth)
								{
									this.gDiv.style.width = newW + 'px';
									p.width = newW;
								}
						}

						var newH = v.h + diff;
						if ((newH > p.minheight || p.height < p.minheight) && !v.hgo)
							{
								this.bDiv.style.height = newH + 'px';
								p.height = newH;
								this.fixHeight(newH);
							}
						v = null;
					}
				else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left || e.pageY > this.hset.bottom || e.pageY < this.hset.top)
					{
						//this.dragEnd();
						$('body').css('cursor','move');
					}
					else
					$('body').css('cursor','pointer');
					$(this.colCopy).css({top:e.pageY + 10,left:e.pageX + 20, display: 'block'});
				}

			},
			dragEnd: function () {

				if (this.colresize)
					{
						var n = this.colresize.n;
						var nw = this.colresize.nw;

								$('th:visible div:eq('+n+')',this.hDiv).css('width',nw);
								$('tr',this.bDiv).each (
									function ()
										{
										$('td:visible div:eq('+n+')',this).css('width',nw);
										}
								);
								this.hDiv.scrollLeft = this.bDiv.scrollLeft;


						$('div:eq('+n+')',this.cDrag).siblings().show();
						$('.dragging',this.cDrag).removeClass('dragging');
						this.rePosDrag();
						this.colresize = false;
					}
				else if (this.vresize)
					{
						this.vresize = false;
					}
				else if (this.colCopy)
					{
						$(this.colCopy).remove();
						if (this.dcolt != null)
							{


							if (this.dcoln>this.dcolt)

								$('th:eq('+this.dcolt+')',this.hDiv).before(this.dcol);
							else
								$('th:eq('+this.dcolt+')',this.hDiv).after(this.dcol);



							this.switchCol(this.dcoln,this.dcolt);
							$(this.cdropleft).remove();
							$(this.cdropright).remove();
							this.rePosDrag();


							}

						this.dcol = null;
						this.hset = null;
						this.dcoln = null;
						this.dcolt = null;
						this.colCopy = null;

						$('.thMove',this.hDiv).removeClass('thMove');
						$(this.cDrag).show();
					}
				$('body').css('cursor','default');
				$('body').noSelect(false);
			},
			toggleCol: function(cid,visible) {

				var ncol = $("th[axis='col"+cid+"']",this.hDiv)[0];
				var n = $('thead th',g.hDiv).index(ncol);
				var cb = $('input[value='+cid+']',g.nDiv)[0];


				if (visible==null)
					{
						visible = ncol.hide;
					}



				if ($('input:checked',g.nDiv).length<p.minColToggle&&!visible) return false;

				if (visible)
					{
						ncol.hide = false;
						$(ncol).show();
						cb.checked = true;
					}
				else
					{
						ncol.hide = true;
						$(ncol).hide();
						cb.checked = false;
					}

						$('tbody tr',t).each
							(
								function ()
									{
										if (visible)
											$('td:eq('+n+')',this).show();
										else
											$('td:eq('+n+')',this).hide();
									}
							);

				this.rePosDrag();

				if (p.onToggleCol) p.onToggleCol(cid,visible);

				return visible;
			},
			switchCol: function(cdrag,cdrop) { //switch columns

				$('tbody tr',t).each
					(
						function ()
							{
								if (cdrag>cdrop)
									$('td:eq('+cdrop+')',this).before($('td:eq('+cdrag+')',this));
								else
									$('td:eq('+cdrop+')',this).after($('td:eq('+cdrag+')',this));
							}
					);

					//switch order in nDiv
					if (cdrag>cdrop)
						$('tr:eq('+cdrop+')',this.nDiv).before($('tr:eq('+cdrag+')',this.nDiv));
					else
						$('tr:eq('+cdrop+')',this.nDiv).after($('tr:eq('+cdrag+')',this.nDiv));

					if ($.browser.msie&&$.browser.version<7.0) $('tr:eq('+cdrop+') input',this.nDiv)[0].checked = true;

					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},
			scroll: function() {
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					this.rePosDrag();
			},
			addData: function (data) { //parse data

				$('.pReload',this.pDiv).removeClass('loading');
				this.loading = false;

				if (!data)
					{
					$('.pPageStat',this.pDiv).html(p.errormsg);
					return false;
					}

				if (p.dataType=='xml')
					p.total = +$('rows total',data).text();
				else
					p.total = data.total;

				if (p.total==0)
					{
					$('tr',t).unbind();
					$(t).empty();
					p.pages = 1;
					p.page = 1;
					this.buildpager();
					$('.pPageStat',this.pDiv).html(p.nomsg);
					return false;
					}

				p.pages = Math.ceil(p.total/p.rp);

				if (p.dataType=='xml')
					p.page = +$('rows page',data).text();
				else
					p.page = data.page;

				this.buildpager();

				//build new body
				var tbody = document.createElement('tbody');

				if (p.dataType=='json')
				{
					$.each
					(
					 data.rows,
					 function(i,row)
					 	{
							var tr = document.createElement('tr');
							if (i % 2 && p.striped) tr.className = 'erow';

							if (row.id) tr.id = 'row' + row.id;

							//add cell
							$('thead tr:first th',g.hDiv).each
							(
							 	function ()
									{

										var td = document.createElement('td');
										var idx = $(this).attr('axis').substr(3);
										td.align = this.align;
										td.innerHTML = row.cell[idx];
										$(tr).append(td);
										td = null;
									}
							);

							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{

									for (idx=0;idx<cell.length;idx++)
										{
										var td = document.createElement('td');
										td.innerHTML = row.cell[idx];
										$(tr).append(td);
										td = null;
										}
							}

							$(tbody).append(tr);
							tr = null;
						}
					);

				} else if (p.dataType=='xml') {

				i = 1;

				$("rows row",data).each
				(

				 	function ()
						{

							i++;

							var tr = document.createElement('tr');
							if (i % 2 && p.striped) tr.className = 'erow';

							var nid =$(this).attr('id');
							if (nid) tr.id = 'row' + nid;

							nid = null;

							var robj = this;



							$('thead tr:first th',g.hDiv).each
							(
							 	function ()
									{

										var td = document.createElement('td');
										var idx = $(this).attr('axis').substr(3);
										td.align = this.align;
										td.innerHTML = $("cell:eq("+ idx +")",robj).text();
										$(tr).append(td);
										td = null;
									}
							);


							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{
								$('cell',this).each
								(
								 	function ()
										{
										var td = document.createElement('td');
										td.innerHTML = $(this).text();
										$(tr).append(td);
										td = null;
										}
								);
							}

							$(tbody).append(tr);
							tr = null;
							robj = null;
						}
				);

				}

				$('tr',t).unbind();
				$(t).empty();

				$(t).append(tbody);
				this.addCellProp();
				this.addRowProp();

				this.fixHeight($(this.bDiv).height());

				this.rePosDrag();

				tbody = null; data = null; i = null;

				if (p.onSuccess) p.onSuccess();
				if (p.hideOnSubmit) $(g.block).remove();//$(t).show();

				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if ($.browser.opera) $(t).css('visibility','visible');

			},
			changeSort: function(th) { //change sortorder

				if (this.loading) return true;

				$(g.nDiv).hide();$(g.nBtn).hide();

				if (p.sortname == $(th).attr('abbr'))
					{
						if (p.sortorder=='asc') p.sortorder = 'desc';
						else p.sortorder = 'asc';
					}

				$(th).addClass('sorted').siblings().removeClass('sorted');
				$('.sdesc',this.hDiv).removeClass('sdesc');
				$('.sasc',this.hDiv).removeClass('sasc');
				$('div',th).addClass('s'+p.sortorder);
				p.sortname= $(th).attr('abbr');

				if (p.onChangeSort)
					p.onChangeSort(p.sortname,p.sortorder);
				else
					this.populate();

			},
			buildpager: function(){ //rebuild pager based on new properties

			$('.pcontrol input').val(p.page);
			$('.pcontrol span').html(p.pages);

			var r1 = (p.page-1) * p.rp + 1;
			var r2 = r1 + p.rp - 1;

			if (p.total<r2) r2 = p.total;

			var stat = p.pagestat;

			stat = stat.replace(/{from}/,r1);
			stat = stat.replace(/{to}/,r2);
			stat = stat.replace(/{total}/,p.total);

			$('.pPageStat',this.pDiv).html(stat);

			},
			populate: function () { //get latest data

				if (this.loading) return true;

				if (p.onSubmit)
					{
						var gh = p.onSubmit();
						if (!gh) return false;
					}

				this.loading = true;
				if (!p.url) return false;

				$('.pPageStat',this.pDiv).html(p.procmsg);

				$('.pReload',this.pDiv).addClass('loading');

				$(g.block).css({top:g.bDiv.offsetTop});

				if (p.hideOnSubmit) $(this.gDiv).prepend(g.block); //$(t).hide();

				if ($.browser.opera) $(t).css('visibility','hidden');

				if (!p.newp) p.newp = 1;

				if (p.page>p.pages) p.page = p.pages;
				var param = {page:p.newp, rp: p.rp, sortname: p.sortname, sortorder: p.sortorder, query: p.query, qtype: p.qtype};

				if (p.params)
					{
						var nparam = {};
						$.each(p.params, function() {
						  nparam[this.name] = this.value;
						});
						$.extend(param,nparam);
					}

				$.ajax({
				   type: p.method,
				   url: p.url,
				   data: param,
				   dataType: p.dataType,
				   success: function(data){g.addData(data);}
				 });
			},
			doSearch: function () {
				p.query = $('input[name=q]',g.sDiv).val();
				p.qtype = $('select[name=qtype]',g.sDiv).val();
				p.newp = 1;
				this.populate();
			},
			changePage: function (ctype){ //change page

				if (this.loading) return true;

				switch(ctype)
				{
					case 'first': p.newp = 1; break;
					case 'prev': if (p.page>1) p.newp = p.page - 1; break;
					case 'next': if (p.page<p.pages) p.newp = p.page + 1; break;
					case 'last': p.newp = p.pages; break;
					case 'input':
							var nv = parseInt($('.pcontrol input').val());
							if (isNaN(nv)) nv = 1;
							if (nv<1) nv = 1;
							else if (nv > p.pages) nv = p.pages;
							$('.pcontrol input').val(nv);
							p.newp =nv;
							break;
				}

				if (p.newp==p.page) return false;

				if (p.onChangePage)
					p.onChangePage(p.newp);
				else
					this.populate();

			},
			addCellProp: function ()
			{

					$('tbody tr td',g.bDiv).each
					(
						function ()
							{
									var tdDiv = document.createElement('div');
									var n = $('td',$(this).parent()).index(this);
									var pth = $('th:eq('+n+')',g.hDiv).get(0);

									if (pth!=null)
									{
									if (p.sortname==$(pth).attr('abbr')&&p.sortname)
										{
										this.className = 'sorted';
										}
									 $(tdDiv).css({textAlign:pth.align,width: $('div:first',pth)[0].style.width});

									 if (pth.hide) $(this).css('display','none');

									 }

									 if (p.nowrap==false) $(tdDiv).css('white-space','normal');

									 if (this.innerHTML=='') this.innerHTML = '&nbsp;';

									 //tdDiv.value = this.innerHTML; //store preprocess value
									 tdDiv.innerHTML = this.innerHTML;

									 var prnt = $(this).parent()[0];
									 var pid = false;
									 if (prnt.id) pid = prnt.id.substr(3);

									 if (pth!=null)
									 {
									 if (pth.process) pth.process(tdDiv,pid);
									 }

									$(this).empty().append(tdDiv).removeAttr('width'); //wrap content

									//add editable event here 'dblclick'

							}
					);

			},
			getCellDim: function (obj) // get cell prop for editable event
			{
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {ht:ht,wt:wt,top:top,left:left,pdl:pdl, pdt:pdt, pht:pht, pwt: pwt};
			},
			addRowProp: function()
			{
					$('tbody tr',g.bDiv).each
					(
						function ()
							{
							$(this)
							.click(
								function (e)
									{
										var obj = (e.target || e.srcElement); if (obj.href || obj.type) return true;
										$(this).toggleClass('trSelected');
									}
							)
							.mousedown(
								function (e)
									{
										if (e.shiftKey)
										{
										$(this).toggleClass('trSelected');
										g.multisel = true;
										this.focus();
										$(g.gDiv).noSelect();
										}
									}
							)
							.mouseup(
								function ()
									{
										if (g.multisel)
										{
										g.multisel = false;
										$(g.gDiv).noSelect(false);
										}
									}
							)
							.hover(
								function (e)
									{
									if (g.multisel)
										{
										$(this).toggleClass('trSelected');
										}
									},
								function () {}
							)
							;

							if ($.browser.msie&&$.browser.version<7.0)
								{
									$(this)
									.hover(
										function () { $(this).addClass('trOver'); },
										function () { $(this).removeClass('trOver'); }
									)
									;
								}
							}
					);


			},
			pager: 0
			};

		//create model if any
		if (p.colModel)
		{
			thead = document.createElement('thead');
			tr = document.createElement('tr');

			var z = p.colModel.length; //Oliver
			//for (i in p.colModel)  //Oliver
			for (j=0; j<z; j++) //Oliver
				{
					i = j; //Oliver

					var cm = p.colModel[i];
					var th = document.createElement('th');

					th.innerHTML = cm.display;

					if (cm.name)
						$(th).attr('abbr',cm.name);

					//th.idx = i;
					$(th).attr('axis','col'+i);

					if (cm.align)
						th.align = cm.align;

					if (cm.width)
						$(th).attr('width',cm.width);

					if (cm.hide)
						{
						th.hide = true;
						}

					if (cm.process)
						{
							th.process = cm.process;
						}

					$(tr).append(th);
				}
			$(thead).append(tr);
			$(t).prepend(thead);
		} // end if p.colmodel

		//init divs
		g.gDiv = document.createElement('div'); //create global container
		g.mDiv = document.createElement('div'); //create title container
		g.hDiv = document.createElement('div'); //create header container
		g.bDiv = document.createElement('div'); //create body container
		g.vDiv = document.createElement('div'); //create grip
		g.rDiv = document.createElement('div'); //create horizontal resizer
		g.cDrag = document.createElement('div'); //create column drag
		g.block = document.createElement('div'); //creat blocker
		g.nDiv = document.createElement('div'); //create column show/hide popup
		g.nBtn = document.createElement('div'); //create column show/hide button
		g.iDiv = document.createElement('div'); //create editable layer
		g.tDiv = document.createElement('div'); //create toolbar
		g.sDiv = document.createElement('div');

		if (p.usepager) g.pDiv = document.createElement('div'); //create pager container
		g.hTable = document.createElement('table');

		//set gDiv
		g.gDiv.className = 'flexigrid';
		if (p.width!='auto') g.gDiv.style.width = p.width + 'px';

		//add conditional classes
		if ($.browser.msie)
			$(g.gDiv).addClass('ie');

		if (p.novstripe)
			$(g.gDiv).addClass('novstripe');

		$(t).before(g.gDiv);
		$(g.gDiv)
		.append(t)
		;

		//set toolbar
		if (p.buttons)
		{
			g.tDiv.className = 'tDiv';
			var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';

			var z = p.buttons.length; //Oliver
			//for (i in p.colModel)  //Oliver
//			for (i in p.buttons) //Oliver
			for (j=0; j<z; j++) //Oliver
				{
					i=j; // Oliver
					var btn = p.buttons[i];
					if (!btn.separator)
					{
						var btnDiv = document.createElement('div');
						btnDiv.className = 'fbutton';
						btnDiv.innerHTML = "<div><span>"+btn.name+"</span></div>";
						if (btn.bclass)
							$('span',btnDiv)
							.addClass(btn.bclass)
							.css({paddingLeft:20})
							;
						btnDiv.onpress = btn.onpress;
						btnDiv.name = btn.name;
						if (btn.onpress)
						{
							$(btnDiv).click
							(
								function ()
								{
								this.onpress(this.name,g.gDiv);
								}
							);
						}
						$(tDiv2).append(btnDiv);
						if ($.browser.msie&&$.browser.version<7.0)
						{
							$(btnDiv).hover(function(){$(this).addClass('fbOver');},function(){$(this).removeClass('fbOver');});
						}

					} else {
						$(tDiv2).append("<div class='btnseparator'></div>");
					}
				}
				$(g.tDiv).append(tDiv2);
				$(g.tDiv).append("<div style='clear:both'></div>");
				$(g.gDiv).prepend(g.tDiv);
		}

		//set hDiv
		g.hDiv.className = 'hDiv';

		$(t).before(g.hDiv);

		//set hTable
			g.hTable.cellPadding = 0;
			g.hTable.cellSpacing = 0;
			$(g.hDiv).append('<div class="hDivBox"></div>');
			$('div',g.hDiv).append(g.hTable);
			var thead = $("thead:first",t).get(0);
			if (thead) $(g.hTable).append(thead);
			thead = null;

		if (!p.colmodel) var ci = 0;

		//setup thead
			$('thead tr:first th',g.hDiv).each
			(
			 	function ()
					{
						var thdiv = document.createElement('div');



						if ($(this).attr('abbr'))
							{
							$(this).click(
								function (e)
									{

										if (!$(this).hasClass('thOver')) return false;
										var obj = (e.target || e.srcElement);
										if (obj.href || obj.type) return true;
										g.changeSort(this);
									}
							)
							;

							if ($(this).attr('abbr')==p.sortname)
								{
								this.className = 'sorted';
								thdiv.className = 's'+p.sortorder;
								}
							}

							if (this.hide) $(this).hide();

							if (!p.colmodel)
							{
								$(this).attr('axis','col' + ci++);
							}

						 $(thdiv).css({textAlign:this.align, width: this.width + 'px'});
						 thdiv.innerHTML = this.innerHTML;

						$(this).empty().append(thdiv).removeAttr('width')
						.mousedown(function (e) {g.dragStart('colMove',e,this)})
						.hover(
							function(){
								if (!g.colresize&&!$(this).hasClass('thMove')&&!g.colCopy) $(this).addClass('thOver');

								if ($(this).attr('abbr')!=p.sortname&&!g.colCopy&&!g.colresize&&$(this).attr('abbr')) $('div',this).addClass('s'+p.sortorder);
								else if ($(this).attr('abbr')==p.sortname&&!g.colCopy&&!g.colresize&&$(this).attr('abbr'))
									{
										var no = '';
										if (p.sortorder=='asc') no = 'desc';
										else no = 'asc';
										$('div',this).removeClass('s'+p.sortorder).addClass('s'+no);
									}

								if (g.colCopy)
									{
									var n = $('th',g.hDiv).index(this);

									if (n==g.dcoln) return false;



									if (n<g.dcoln) $(this).append(g.cdropleft);
									else $(this).append(g.cdropright);

									g.dcolt = n;

									} else if (!g.colresize) {

									var nv = $('th:visible',g.hDiv).index(this);
									var onl = parseInt($('div:eq('+nv+')',g.cDrag).css('left'));
									var nw = parseInt($(g.nBtn).width()) + parseInt($(g.nBtn).css('borderLeftWidth'));
									nl = onl - nw + Math.floor(p.cgwidth/2);

									$(g.nDiv).hide();$(g.nBtn).hide();

									$(g.nBtn).css({'left':nl,top:g.hDiv.offsetTop}).show();

									var ndw = parseInt($(g.nDiv).width());

									$(g.nDiv).css({top:g.bDiv.offsetTop});

									if ((nl+ndw)>$(g.gDiv).width())
										$(g.nDiv).css('left',onl-ndw+1);
									else
										$(g.nDiv).css('left',nl);

									if ($(this).hasClass('sorted'))
										$(g.nBtn).addClass('srtd');
									else
										$(g.nBtn).removeClass('srtd');

									}

							},
							function(){
								$(this).removeClass('thOver');
								if ($(this).attr('abbr')!=p.sortname) $('div',this).removeClass('s'+p.sortorder);
								else if ($(this).attr('abbr')==p.sortname)
									{
										var no = '';
										if (p.sortorder=='asc') no = 'desc';
										else no = 'asc';

										$('div',this).addClass('s'+p.sortorder).removeClass('s'+no);
									}
								if (g.colCopy)
									{
									$(g.cdropleft).remove();
									$(g.cdropright).remove();
									g.dcolt = null;
									}
							})
						; //wrap content
					}
			);

		//set bDiv
		g.bDiv.className = 'bDiv';
		$(t).before(g.bDiv);
		$(g.bDiv)
		.css({ height: (p.height=='auto') ? 'auto' : p.height+"px"})
		.scroll(function (e) {g.scroll()})
		.append(t)
		;

		if (p.height == 'auto')
			{
			$('table',g.bDiv).addClass('autoht');
			}


		//add td properties
		g.addCellProp();

		//add row properties
		g.addRowProp();

		//set cDrag

		var cdcol = $('thead tr:first th:first',g.hDiv).get(0);

		if (cdcol != null)
		{
		g.cDrag.className = 'cDrag';
		g.cdpad = 0;

		g.cdpad += (isNaN(parseInt($('div',cdcol).css('borderLeftWidth'))) ? 0 : parseInt($('div',cdcol).css('borderLeftWidth')));
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('borderRightWidth'))) ? 0 : parseInt($('div',cdcol).css('borderRightWidth')));
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingLeft'))) ? 0 : parseInt($('div',cdcol).css('paddingLeft')));
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingRight'))) ? 0 : parseInt($('div',cdcol).css('paddingRight')));
		g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0 : parseInt($(cdcol).css('borderLeftWidth')));
		g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0 : parseInt($(cdcol).css('borderRightWidth')));
		g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0 : parseInt($(cdcol).css('paddingLeft')));
		g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0 : parseInt($(cdcol).css('paddingRight')));

		$(g.bDiv).before(g.cDrag);

		var cdheight = $(g.bDiv).height();
		var hdheight = $(g.hDiv).height();

		$(g.cDrag).css({top: -hdheight + 'px'});

		$('thead tr:first th',g.hDiv).each
			(
			 	function ()
					{
						var cgDiv = document.createElement('div');
						$(g.cDrag).append(cgDiv);
						if (!p.cgwidth) p.cgwidth = $(cgDiv).width();
						$(cgDiv).css({height: cdheight + hdheight})
						.mousedown(function(e){g.dragStart('colresize',e,this);})
						;
						if ($.browser.msie&&$.browser.version<7.0)
						{
							g.fixHeight($(g.gDiv).height());
							$(cgDiv).hover(
								function ()
								{
								g.fixHeight();
								$(this).addClass('dragging')
								},
								function () { if (!g.colresize) $(this).removeClass('dragging') }
							);
						}
					}
			);

		g.rePosDrag();

		}


		//add strip
		if (p.striped)
			$('tbody tr:odd',g.bDiv).addClass('erow');


		if (p.resizable && p.height !='auto')
		{
		g.vDiv.className = 'vGrip';
		$(g.vDiv)
		.mousedown(function (e) { g.dragStart('vresize',e)})
		.html('<span></span>');
		$(g.bDiv).after(g.vDiv);
		}

		if (p.resizable && p.width !='auto')
		{
		g.rDiv.className = 'hGrip';
		$(g.rDiv)
		.mousedown(function (e) {g.dragStart('vresize',e,true);})
		.html('<span></span>')
		.css('height',$(g.gDiv).height())
		;
		if ($.browser.msie&&$.browser.version<7.0)
		{
			$(g.rDiv).hover(function(){$(this).addClass('hgOver');},function(){$(this).removeClass('hgOver');});
		}
		$(g.gDiv).append(g.rDiv);
		}

		// add pager
		if (p.usepager)
		{
		g.pDiv.className = 'pDiv';
		g.pDiv.innerHTML = '<div class="pDiv2"></div>';
		$(g.bDiv).after(g.pDiv);

		var pageof = p.pageof; //Oliver
		pageof = pageof.replace(/{%1}/,'<input type="text" size="4" value="1" />'); //Oliver

		var html = ' <div class="pGroup"> <div class="pFirst pButton"><span></span></div><div class="pPrev pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">'+pageof+' <span> 1 </span></span></div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pNext pButton"><span></span></div><div class="pLast pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pReload pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pPageStat"></span></div>';
		$('div',g.pDiv).html(html);

		$('.pReload',g.pDiv).click(function(){g.populate()});
		$('.pFirst',g.pDiv).click(function(){g.changePage('first')});
		$('.pPrev',g.pDiv).click(function(){g.changePage('prev')});
		$('.pNext',g.pDiv).click(function(){g.changePage('next')});
		$('.pLast',g.pDiv).click(function(){g.changePage('last')});
		$('.pcontrol input',g.pDiv).keydown(function(e){if(e.keyCode==13) g.changePage('input')});
		if ($.browser.msie&&$.browser.version<7) $('.pButton',g.pDiv).hover(function(){$(this).addClass('pBtnOver');},function(){$(this).removeClass('pBtnOver');});

			if (p.useRp)
			{
			var opt = "";

			var z = p.rpOptions.length; //Oliver
//			for (var nx in p.rpOptions) //Oliver
			for (j=0; j<z; j++) //Oliver
			{
				nx=j; // Oliver
				if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"'; else sel = '';
				 opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
			};
			$('.pDiv2',g.pDiv).prepend("<div class='pGroup'><select name='rp'>"+opt+"</select></div> <div class='btnseparator'></div>");
			$('select',g.pDiv).change(
					function ()
					{
						if (p.onRpChange)
							p.onRpChange(+this.value);
						else
							{
							p.newp = 1;
							p.rp = +this.value;
							g.populate();
							}
					}
				);
			}

		//add search button
		if (p.searchitems)
			{
				$('.pDiv2',g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
				$('.pSearch',g.spDiv).click(function(){$(g.sDiv).slideToggle('fast',function(){$('.sDiv:visible input:first',g.gDiv).trigger('focus');});});
				//add search box
				g.sDiv.className = 'sDiv';

				sitems = p.searchitems;

				var sopt = "";
				for (var s = 0; s < sitems.length; s++)
				{
					if (p.qtype=='' && sitems[s].isdefault==true)
					{
					p.qtype = sitems[s].name;
					sel = 'selected="selected"';
					} else sel = '';
					sopt += "<option value='" + sitems[s].name + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";
				}

				if (p.qtype=='') p.qtype = sitems[0].name;

				$(g.sDiv).append("<div class='sDiv2'>Quick Search <input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>"+sopt+"</select> <input type='button' value='Clear' /></div>");

				$('input[name=q],select[name=qtype]',g.sDiv).keydown(function(e){if(e.keyCode==13) g.doSearch()});
				$('input[value=Clear]',g.sDiv).click(function(){$('input[name=q]',g.sDiv).val(''); p.query = ''; g.doSearch(); });
				$(g.bDiv).after(g.sDiv);

			}

		}
		$(g.pDiv,g.sDiv).append("<div style='clear:both'></div>");

		// add title
		if (p.title)
		{
			g.mDiv.className = 'mDiv';
			g.mDiv.innerHTML = '<div class="ftitle">'+p.title+'</div>';
			$(g.gDiv).prepend(g.mDiv);
			if (p.showTableToggleBtn)
				{
					$(g.mDiv).append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
					$('div.ptogtitle',g.mDiv).click
					(
					 	function ()
							{
								$(g.gDiv).toggleClass('hideBody');
								$(this).toggleClass('vsble');
							}
					);
				}
		}

		//setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';

		//add block
		g.block.className = 'gBlock';
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		$(g.block).css(
		{
			width: g.bDiv.style.width,
			height: gh,
			background: 'white',
			position: 'relative',
			marginBottom: (gh * -1),
			zIndex: 999,
			top: gtop,
			left: '0px'
		}
		);
		//$(g.block).fadeTo(0,p.blockOpacity);

		// add column control
		if ($('th',g.hDiv).length)
		{

			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css(
			{
				marginBottom: (gh * -1),
				display: 'none',
				top: gtop
			}
			).noSelect()
			;

			var cn = 0;


			$('th div',g.hDiv).each
			(
			 	function ()
					{
						var kcol = $("th[axis='col" + cn + "']",g.hDiv)[0];
						var chk = 'checked="checked"';
						if (kcol.style.display=='none') chk = '';

						$('tbody',g.nDiv).append('<tr><td class="ndcol1"><input type="checkbox" '+ chk +' class="togCol" value="'+ cn +'" /></td><td class="ndcol2">'+this.innerHTML+'</td></tr>');
						cn++;
					}
			);

			if ($.browser.msie&&$.browser.version<7.0)
				$('tr',g.nDiv).hover
				(
				 	function () {$(this).addClass('ndcolover');},
					function () {$(this).removeClass('ndcolover');}
				);

			$('td.ndcol2',g.nDiv).click
			(
			 	function ()
					{
						if ($('input:checked',g.nDiv).length<=p.minColToggle&&$(this).prev().find('input')[0].checked) return false;
						return g.toggleCol($(this).prev().find('input').val());
					}
			);

			$('input.togCol',g.nDiv).click
			(
			 	function ()
					{

						if ($('input:checked',g.nDiv).length<p.minColToggle&&this.checked==false) return false;
						$(this).parent().next().trigger('click');
						//return false;
					}
			);


			$(g.gDiv).prepend(g.nDiv);

			$(g.nBtn).addClass('nBtn')
			.html('<div></div>')
			.attr('title','Hide/Show Columns')
			.css('top',g.hDiv.offsetTop)
			.click
			(
			 	function ()
				{
			 	$(g.nDiv).toggle(); return true;
				}
			);

			if (p.showToggleBtn) $(g.gDiv).prepend(g.nBtn);

		}

		// add date edit layer
		$(g.iDiv)
		.addClass('iDiv')
		.css({display:'none'})
		;
		$(g.bDiv).append(g.iDiv);

		// add flexigrid events
		$(g.bDiv)
		.hover(function(){$(g.nDiv).hide();$(g.nBtn).hide();},function(){if (g.multisel) g.multisel = false;})
		;
		$(g.gDiv)
		.hover(function(){},function(){$(g.nDiv).hide();$(g.nBtn).hide();})
		;

		//add document events
		$(document)
		.mousemove(function(e){g.dragMove(e)})
		.mouseup(function(e){g.dragEnd()})
		.hover(function(){},function (){g.dragEnd()})
		;

		//browser adjustments
		if ($.browser.msie&&$.browser.version<7.0)
		{
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv',g.gDiv)
			.css({width: '100%'});
			$(g.gDiv).addClass('ie6');
			if (p.width!='auto') $(g.gDiv).addClass('ie6fullwidthbug');
		}

		//make grid functions accessible
		t.p = p;
		t.grid = g;

		// load data
		if (p.url&&p.autoload)
			{
			g.populate();
			}

		return t;

	};

	var docloaded = false;

	$(document).ready(function () {docloaded = true} );

	$.fn.flexigrid = function(p) {

		return this.each( function() {
				if (!docloaded)
				{
					$(this).hide();
					var t = this;
					$(document).ready
					(
						function ()
						{
						$.addFlex(t,p);
						}
					);
				} else {
					$.addFlex(this,p);
				}
			});

	}; //end flexigrid

	$.fn.flexReload = function(p) { // function to reload grid

		return this.each( function() {
				if (this.grid&&this.p.url) this.grid.populate();
			});

	}; //end flexReload

	$.fn.flexOptions = function(p) { //function to update general options

		return this.each( function() {
				if (this.grid) $.extend(this.p,p);
			});

	}; //end flexOptions

	$.fn.flexToggleCol = function(cid,visible) { // function to reload grid

		return this.each( function() {
				if (this.grid) this.grid.toggleCol(cid,visible);
			});

	}; //end flexToggleCol


	$.fn.noSelect = function(p) { //no select plugin by me :-)

		if (p == null)
			prevent = true;
		else
			prevent = p;

		if (prevent) {

		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).bind('selectstart',function(){return false;});
				else if ($.browser.mozilla)
					{
						$(this).css('MozUserSelect','none');
						$('body').trigger('focus');
					}
				else if ($.browser.opera) $(this).bind('mousedown',function(){return false;});
				else $(this).attr('unselectable','on');
			});

		} else {


		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).unbind('selectstart');
				else if ($.browser.mozilla) $(this).css('MozUserSelect','inherit');
				else if ($.browser.opera) $(this).unbind('mousedown');
				else $(this).removeAttr('unselectable','on');
			});

		}

	}; //end noSelect

})(jQuery);


/*
 * Jeditable - jQuery in place edit plugin
 *
 * Copyright (c) 2006-2008 Mika Tuupola, Dylan Verheul
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Based on editable by Dylan Verheul <dylan_at_dyve.net>:
 *    http://www.dyve.net/jquery/?editable
 *
 * Revision: $Id: jquery.jeditable.js 344 2008-03-24 16:02:11Z tuupola $
 *
 */
/**
  * Version 1.5.7
  *
  * @name  Jeditable
  * @type  jQuery
  * @param String  target             POST URL or function name to send edited content
  * @param Hash    options            additional options
  * @param Function options[callback] Function to run after submitting edited content
  * @param String  options[name]      POST parameter name of edited content
  * @param String  options[id]        POST parameter name of edited div id
  * @param Hash    options[submitdata] Extra parameters to send when submitting edited content.
  * @param String  options[type]      text, textarea or select
  * @param Integer options[rows]      number of rows if using textarea
  * @param Integer options[cols]      number of columns if using textarea
  * @param Mixed   options[height]    'auto', 'none' or height in pixels
  * @param Mixed   options[width]     'auto', 'none' or width in pixels
  * @param String  options[loadurl]   URL to fetch input content before editing
  * @param String  options[loadtype]  Request type for load url. Should be GET or POST.
  * @param String  options[loadtext]  Text to display while loading external content.
  * @param Hash    options[loaddata]  Extra parameters to pass when fetching content before editing.
  * @param String  options[data]      Or content given as paramameter.
  * @param String  options[indicator] indicator html to show when saving
  * @param String  options[tooltip]   optional tooltip text via title attribute
  * @param String  options[event]     jQuery event such as 'click' of 'dblclick'
  * @param String  options[onblur]    'cancel', 'submit' or 'ignore'
  * @param String  options[submit]    submit button value, empty means no button
  * @param String  options[cancel]    cancel button value, empty means no button
  * @param String  options[cssclass]  CSS class to apply to input form. 'inherit' to copy from parent.
  * @param String  options[style]     Style to apply to input form 'inherit' to copy from parent.
  * @param String  options[select]    true or false, when true text is highlighted
  * @param String  options[placeholder] Placeholder text or html to insert when element is empty.
  *
  */
(function($) {
    $.fn.editable = function(target, options) {

        var settings = {
            target     : target,
            name       : 'value',
            id         : 'id',
            type       : 'text',
            width      : 'auto',
            height     : 'auto',
            event      : 'click',
            onblur     : 'cancel',
            loadtype   : 'GET',
            loadtext   : 'Loading...',
            placeholder: 'Click to edit',
            loaddata   : {},
            submitdata : {}
        };

        if(options) {
            $.extend(settings, options);
        }

        /* setup some functions */
        var plugin   = $.editable.types[settings.type].plugin || function() { };
        var submit   = $.editable.types[settings.type].submit || function() { };
        var buttons  = $.editable.types[settings.type].buttons
                    || $.editable.types['defaults'].buttons;
        var content  = $.editable.types[settings.type].content
                    || $.editable.types['defaults'].content;
        var element  = $.editable.types[settings.type].element
                    || $.editable.types['defaults'].element;
        var callback = settings.callback || function() { };

        /* add custom event if it does not exist */
        if  (!$.isFunction($(this)[settings.event])) {
            $.fn[settings.event] = function(fn){
          		return fn ? this.bind(settings.event, fn) : this.trigger(settings.event);
          	}
        }

        $(this).attr('title', settings.tooltip);

        settings.autowidth  = 'auto' == settings.width;
        settings.autoheight = 'auto' == settings.height;
        return this.each(function() {

            /* if element is empty add something clickable (if requested) */
            if (!$.trim($(this).html())) {
                $(this).html(settings.placeholder);
            }

            $(this)[settings.event](function(e) {
                /* save this to self because this changes when scope changes */
                var self = this;
                /* prevent throwing an exeption if edit field is clicked again */
                if (self.editing) {
                    return;
                }
                /* figure out how wide and tall we are, visibility trick */
                /* is workaround for http://dev.jquery.com/ticket/2190 */
                $(self).css('visibility', 'hidden');
                if (settings.width != 'none') {
                    settings.width =
                        settings.autowidth ? $(self).width()  : settings.width;
                }
                if (settings.height != 'none') {
                    settings.height =
                        settings.autoheight ? $(self).height() : settings.height;
                }
                $(this).css('visibility', '');


                /* remove placeholder text, replace is here because of IE */
                if ($(this).html().toLowerCase().replace(/;/, '') ==
                    settings.placeholder.toLowerCase().replace(/;/, '')) {
                        $(this).html('');
                }

                self.editing    = true;
                self.revert     = $(self).html();
                $(self).html('');
                /* create the form object */
                var form = $('<form/>');

                /* apply css or style or both */
                if (settings.cssclass) {
                    if ('inherit' == settings.cssclass) {
                        form.attr('class', $(self).attr('class'));
                    } else {
                        form.attr('class', settings.cssclass);
                    }
                }
                if (settings.style) {
                    if ('inherit' == settings.style) {
                        form.attr('style', $(self).attr('style'));
                        /* IE needs the second line or display wont be inherited */
                        form.css('display', $(self).css('display'));
                    } else {
                        form.attr('style', settings.style);
                    }
                }
                /* add main input element to form and store it in input */
                var input = element.apply(form, [settings, self]);
                /* set input content via POST, GET, given data or existing value */
                var input_content;

                if (settings.loadurl) {
                    var t = setTimeout(function() {
                        input.disabled = true;
                        content.apply(form, [settings.loadtext, settings, self]);
                    }, 100);
                    var loaddata = {};
                    loaddata[settings.id] = self.id;
                    if ($.isFunction(settings.loaddata)) {
                        $.extend(loaddata, settings.loaddata.apply(self, [self.revert, settings]));
                    } else {
                        $.extend(loaddata, settings.loaddata);
                    }
                    $.ajax({
                       type : settings.loadtype,
                       url  : settings.loadurl,
                       data : loaddata,
                       async : false,
                       success: function(result) {
                       	  window.clearTimeout(t);
                       	  input_content = result;
                          input.disabled = false;
                       }
                    });
                } else if (settings.data) {
                    input_content = settings.data;
                    if ($.isFunction(settings.data)) {
                        input_content = settings.data.apply(self, [self.revert, settings]);
                    }
                } else {
                    input_content = self.revert;
                }
                content.apply(form, [input_content, settings, self]);
                input.attr('name', settings.name);

                /* add buttons to the form */
                buttons.apply(form, [settings, self]);

                /* attach 3rd party plugin if requested */
                plugin.apply(form, [settings, self]);

                /* add created form to self */
                $(self).append(form);
                /* focus to first visible form element */
                $(':input:visible:enabled:first', form).focus();
                /* highlight input contents when requested */
                if (settings.select) {
                    input.select();
                }

                /* discard changes if pressing esc */
                input.keydown(function(e) {
                    if (e.keyCode == 27) {
                        e.preventDefault();
                        reset();
                    }
                });
                /* discard, submit or nothing with changes when clicking outside */
                /* do nothing is usable when navigating with tab */
                var t;
                if ('cancel' == settings.onblur) {
                    input.blur(function(e) {
                        t = setTimeout(reset, 500);
                    });
                } else if ('submit' == settings.onblur) {
                    input.blur(function(e) {
                        form.submit();
                    });
                } else if ($.isFunction(settings.onblur)) {
                    input.blur(function(e) {
                        settings.onblur.apply(self, [input.val(), settings]);
                    });
                } else {
                    input.blur(function(e) {
                      /* TODO: maybe something here */
                    });
                }
                form.submit(function(e) {
                    if (t) {
                        clearTimeout(t);
                    }
                    /* do no submit */
                    e.preventDefault();

                    /* if this input type has a call before submit hook, call it */
                    submit.apply(form, [settings, self]);
                    /* check if given target is function */
                    if ($.isFunction(settings.target)) {
                        var str = settings.target.apply(self, [input.val(), settings]);
                        $(self).html(str);
                        self.editing = false;
                        callback.apply(self, [self.innerHTML, settings]);
                        /* TODO: this is not dry */
                        if (!$.trim($(self).html())) {
                            $(self).html(settings.placeholder);
                        }
                    } else {
                        /* add edited content and id of edited element to POST */
                        var submitdata = {};
                        submitdata[settings.name] = input.val();
                        submitdata[settings.id] = self.id;
                        /* add extra data to be POST:ed */
                        if ($.isFunction(settings.submitdata)) {
                            $.extend(submitdata, settings.submitdata.apply(self, [self.revert, settings]));
                        } else {
                            $.extend(submitdata, settings.submitdata);
                        }
                        /* show the saving indicator */
                        $(self).html(settings.indicator);
                        $.post(settings.target, submitdata, function(str) {
                            $(self).html(str);
                            self.editing = false;
                            callback.apply(self, [self.innerHTML, settings]);
                            /* TODO: this is not dry */
                            if (!$.trim($(self).html())) {
                                $(self).html(settings.placeholder);
                            }
                        });
                    }

                    return false;
                });
                function reset() {
                    $(self).html(self.revert);
                    self.editing   = false;
                    if (!$.trim($(self).html())) {
                        $(self).html(settings.placeholder);
                    }
                }
            });
        });
    };
    $.editable = {
        types: {
            defaults: {
                element : function(settings, original) {
                    var input = $('<input type="hidden">');
                    $(this).append(input);
                    return(input);
                },
                content : function(string, settings, original) {
                    $(':input:first', this).val(string);
                },
                buttons : function(settings, original) {
                    var form = this;
                    if (settings.submit) {
                        /* if given html string use that */
                        if (settings.submit.match(/>$/)) {
                            var submit = $(settings.submit).click(function() {
                                form.submit();
                            });
                        /* otherwise use button with given string as text */
                        } else {
                            var submit = $('<button type="submit">');
                            submit.html(settings.submit);
                        }
                        $(this).append(submit);
                    }
                    if (settings.cancel) {
                        /* if given html string use that */
                        if (settings.cancel.match(/>$/)) {
                            var cancel = $(settings.cancel);
                        /* otherwise use button with given string as text */
                        } else {
                            var cancel = $('<button type="cancel">');
                            cancel.html(settings.cancel);
                        }
                        $(this).append(cancel);
                        $(cancel).click(function(event) {
                            $(original).html(original.revert);
                            original.editing = false;
                            if (!$.trim($(original).html())) {
                                $(original).html(settings.placeholder);
                            }
                            return false;
                        });
                    }
                }
            },
            text: {
                element : function(settings, original) {
                    var input = $('<input>');
                    if (settings.width  != 'none') { input.width(settings.width);  }
                    if (settings.height != 'none') { input.height(settings.height); }
                    /* https://bugzilla.mozilla.org/show_bug.cgi?id=236791 */
                    //input[0].setAttribute('autocomplete','off');
                    input.attr('autocomplete','off');
                    $(this).append(input);
                    return(input);
                }
            },
            textarea: {
                element : function(settings, original) {
                    var textarea = $('<textarea>');
                    if (settings.rows) {
                        textarea.attr('rows', settings.rows);
                    } else {
                        textarea.height(settings.height);
                    }
                    if (settings.cols) {
                        textarea.attr('cols', settings.cols);
                    } else {
                        textarea.width(settings.width);
                    }
                    $(this).append(textarea);
                    return(textarea);
                }
            },
            select: {
                element : function(settings, original) {
                    var select = $('<select>');
                    $(this).append(select);
                    return(select);
                },
                content : function(string, settings, original) {
                    if (String == string.constructor) {
                        eval ('var json = ' + string);
                        for (var key in json) {
                            if (!json.hasOwnProperty(key)) {
                                continue;
                            }
                            if ('selected' == key) {
                                continue;
                            }
                            var option = $('<option>').val(key).append(json[key]);
                            $('select', this).append(option);
                        }
                    }
                    /* Loop option again to set selected. IE needed this... */
                    $('select', this).children().each(function() {
                        if ($(this).val() == json['selected'] ||
                            $(this).text() == original.revert) {
                                $(this).attr('selected', 'selected');
                        };
                    });
                }
            }
        },
        /* Add new input type */
        addInputType: function(name, input) {
            $.editable.types[name] = input;
        }
    };
})(jQuery);