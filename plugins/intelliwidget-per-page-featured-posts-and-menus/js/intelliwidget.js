/*!
 * intelliwidget.js - Javascript for the Admin.
 *
 * @package IntelliWidget
 * @subpackage js
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 *
 */

jQuery(document).ready(function($) {
    /*
     * Use localization object to store tab and panel data
     */
    IWAjax.openPanels   = {};
    IWAjax.ajaxSemaphore   = false;
    var     
    /* 
     * BEGIN FUNCTIONS -- FIXME: can we combine these ajax calls???
     */
     // store panel open state so it can persist across ajax refreshes
    updateOpenPanels = function(container) {
        container.find('.inside').each(function(){
            var inside = $(this).prop('id');
            //console.log('update panels: ' + inside);
            IWAjax.openPanels[inside] = $(this).parent('.postbox').hasClass('closed') ? 0 : 1;
        });
    },
    refreshOpenPanels = function(a,b,c) {
        // only process IW responses
        if ('undefined' == typeof b.responseText || !b.responseText.match(/intelliwidget/)) return;
        
        for (var key in IWAjax.openPanels) {
            //console.log('refresh panels: ' + key);
            if (
                IWAjax.openPanels.hasOwnProperty(key) 
                && 
                IWAjax.openPanels[key] == 1
                ) {
            //console.log('refresh panels: ' + key);
                $('#' + key).parent('.postbox').removeClass('closed');
                $('#' + key).show();
            }
        }
    },
    initTabs = function() {
        $('.iw-tabbed-sections').each(function(){
            var container = $(this);
            container.data('viewWidth', 0);
            container.data('visWidth',  0);
            container.data('leftTabs',  []); 
            container.data('rightTabs', []);
            container.data('visTabs',   []);
            container.find('.iw-tab').each(function(){
                container.data('visTabs').push($(this).prop('id'));
                container.data('visWidth', container.data('visWidth') + $(this).outerWidth());
                $(this).show();
            });
        });
        reflowTabs();
    },
    reflowTabs = function() {
        $('.iw-tabbed-sections').each(function(){
            var container = $(this);
            container.data('viewWidth', container.find('.iw-tabs').width() - 24); // minus space for arrows
            if (container.data('viewWidth') > 0) {
                count = 0;
                while (container.data('visTabs').length && container.data('visWidth') > container.data('viewWidth')) {
                    var leftMost = container.data('visTabs').shift(),
                        tabWidth = $('#' + leftMost).outerWidth();
                    container.data('visWidth', container.data('visWidth') - tabWidth);
                    $('#' + leftMost).hide();
                    container.data('leftTabs').push(leftMost);
                    if (++count > 50) break; // infinite loop safety check
                }
            }
        });
        setArrows();
    },
    rightShiftTabs = function(el) {
        // left arrow clicked, shift all tabs to the right
        var container = el.parent('.iw-tabbed-sections'),
            rightMost;
        if (rightMost = container.data('visTabs').pop()) {
            container.data('visWidth', container.data('visWidth') - $('#' + rightMost).outerWidth());
            $('#' + rightMost).hide();
            container.data('rightTabs').unshift(rightMost);
        }
        if (rightMost = container.data('leftTabs').pop()){
            container.data('visWidth', container.data('visWidth') + $('#' + rightMost).outerWidth());
            $('#' + rightMost).show();
            container.data('visTabs').unshift(rightMost);
        }
        setArrows();
    },
    leftShiftTabs = function(el) {
        // right arrow clicked, shift all tabs to the left
        var container = el.parent('.iw-tabbed-sections'),
            leftMost;
        if (leftMost = container.data('visTabs').shift()) {
            container.data('visWidth', container.data('visWidth') - $('#' + leftMost).outerWidth());
            $('#' + leftMost).hide();
            container.data('leftTabs').push(leftMost);
        }
        if (leftMost = container.data('rightTabs').shift()){
            container.data('visWidth', container.data('visWidth') + $('#' + leftMost).outerWidth());
            $('#' + leftMost).show();
            container.data('visTabs').push(leftMost);
        }
        setArrows();
    },
    setArrows = function() {
        $('.iw-larr, .iw-rarr').css('visibility', 'hidden');
        $('.iw-tabbed-sections').each(function(){
            var container = $(this);
            // if rightTabs, show >>
            if (container.data('rightTabs').length) container.find('.iw-rarr').css('visibility', 'visible');
            // if leftTabs, show <<
            if (container.data('leftTabs').length) container.find('.iw-larr').css('visibility', 'visible');
        });
    },
    bind_events = function(el) {
        // since postbox.js does not delegate events, 
        // we have to rebind toggles on refresh
        $(el).find('.postbox .hndle, .handlediv').on('click', function(e){
            var p = $(this).parent('.postbox'), id = p.attr('id');
            p.toggleClass('closed');
            if ( id ) {
                if ( !p.hasClass('closed') && $.isFunction(postboxes.pbshow) )
                    postboxes.pbshow(id);
                else if ( p.hasClass('closed') && $.isFunction(postboxes.pbhide) )
                    postboxes.pbhide(id);
            }
        });
    },
    /**
     * Ajax Save Custom Post Type Data
     */
    save_cdfdata = function(){
        // disable the button until ajax returns
        $(this).prop('disabled', true);
        // clear previous success/fail icons
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        // unbind button from click event
        $('body').off('click', '#iw_cdfsave', save_cdfdata);
        // show spinner
        $('#intelliwidget_cpt_spinner').show();
        // build post data array
        var postData = {};
        // find inputs for this section
        $('input[name=post_ID],input[name=iwpage],.intelliwidget-input').each(function(index, element) {
            // get field id
            fieldID = $(this).attr('id');
            postData[fieldID] = $(this).val();
        });
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_cdfsave';
        // console.log(postData);
        // send to wp
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                // console.log(response);
                // release button
                $('#iw_cdfsave').prop('disabled', false);
                // hide spinner
                $('#intelliwidget_cpt_spinner').hide();
                // show check mark
                $('.iw-cdf-container').addClass('success');
                return false;  
            }
        ).fail(function(){
            // release button
            $('#iw_cdfsave').prop('disabled', false);
            // hide spinner
            $('#intelliwidget_cpt_spinner').hide();
            // show red X
            $('.iw-cdf-container').addClass('failure');
            return false;  
        });  
        return false;  
    },
    parse_ids = function(id) {
            // parse id to get section number
        var idparts         = id.split('_'),
            boxid           = idparts.pop(),
            objid           = idparts.pop();
        return objid + '_' + boxid;
    },
    /**
     * Ajax Save IntelliWidget Meta Box Data
     */
    save_postdata = function (){ 
        // don't allow add/delete section while saving
        if (true === IWAjax.ajaxSemaphore) return false;
        IWAjax.ajaxSemaphore   = true;
        
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        var // get section selector
            sectionform     = $(this).parents('.iw-tabbed-section').first(),
            container       = sectionform.parent('.iw-tabbed-sections');
            thisID          = sectionform.attr('id'),
            // get controls container selector
            savecontainer   = sectionform.find('.iw-save-container'),
            // get button selector
            savebutton      = sectionform.find('.iw-save'),
            pre             = parse_ids(thisID),
            // build post data array
            postData        = {};
        //console.log('thisID: ' + thisID + ' pre: ' + pre);
        // disable the button until ajax returns
        $(savebutton).prop('disabled', true);
        updateOpenPanels(sectionform);
        // show spinner
        $('.intelliwidget_' + pre + '_spinner').show();
        // unbind button from click event
        $('body').off('click', savebutton, save_postdata);
        // special handling for post types (array of checkboxes)
        postData['intelliwidget_' + pre + '_post_types'] = [];
        postData['iwpage'] = $('#iwpage').val();
        postData[IWAjax.idfield] = $('#' + IWAjax.idfield).val();
        // find inputs for this section
        sectionform.find('select,textarea,input[type=text],input[type=checkbox]:checked,input[type=hidden]').each(
            function() {
            // get field id
            fieldID = $(this).prop('id');
            //console.log('fieldID: ' + fieldID);
            if (fieldID.indexOf('_post_types') > 0) {
                // special handling for post types
                postData['intelliwidget_' + pre + '_post_types'].push($(this).val());
            } else {
                // otherwise add to post data
                postData[fieldID] = $(this).val();
            }
            if ( fieldID.indexOf('_menu_location') > 0 ) {
                // special case for menu_location
                if ( '' != $( this ).val() ) postData[ 'intelliwidget_' + pre + '_replace_widget' ] = 'nav_menu_location-' + $( this ).val();
            }
        });
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_save';
        // console.log(postData);
        // send to wp
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                // console.log(response);
                if ('fail' == response) {
                    // show red X
                    savecontainer.addClass('failure');
                } else {
                    // refresh section form
                    var tab = $(response.tab),
                        curtab = $('.iw-tabs').find('#' + tab.prop('id'));
                    curtab.html(tab.html());
                    sectionform.html(response.form);
                    if ('post' == IWAjax.objtype) bind_events(sectionform);
                    container.tabs('refresh').tabs({active: curtab.index()});
                    // show check mark
                    sectionform.find('.iw-save-container').addClass('success');
                }
                // release button
                savebutton.prop('disabled', false);
                // hide spinner
                $('.intelliwidget_' + pre + '_spinner').hide();
                // release ajax
                IWAjax.ajaxSemaphore   = false;
                return false;  
            }, 'json'
        ).fail(function(){
            // console.log('fail');
            // release button
            savebutton.prop('disabled', false);
            // hide spinner
            $('.intelliwidget_' + pre + '_spinner').hide();
            // show red X
            savecontainer.addClass('failure');
            // release ajax
            IWAjax.ajaxSemaphore   = false;
            return false;  
        });  
        // release ajax 
        IWAjax.ajaxSemaphore   = false;
        return false;  
    },
    /**
     * Ajax Save Copy Page Input
     */
    copy_profile = function (){ 
        // disable the button until ajax returns
        $(this).prop('disabled', true);
        // clear previous success/fail icons
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        // unbind button from click event
        $('body').off('click', '#iw_copy', copy_profile);
        // show spinner
        $('#intelliwidget_spinner').show();
        // build post data array
        var postData = {};
        // find inputs for this section
        postData['iwpage'] = $('#iwpage').val();
        postData[IWAjax.idfield] = $('#' + IWAjax.idfield).val();
        postData['intelliwidget_widget_page_id'] = $('#intelliwidget_widget_page_id').val();
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_copy';
        // console.log(postData);
        // send to wp
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                // console.log(response);
                // release button
                $('#iw_copy').prop('disabled', false);
                // hide spinner
                $('#intelliwidget_spinner').hide();
                // show check mark
                $('.iw-copy-container').addClass('success');
                // release ajax
                IWAjax.ajaxSemaphore   = false;
                return false;  
            }
        ).fail(function(){
            // console.log('fail');
            // release button
            $('#iw_copy').prop('disabled', false);
            // hide spinner
            $('#intelliwidget_spinner').hide();
            // show red X
            $('.iw-copy-container').addClass('failure');
            // release ajax
            IWAjax.ajaxSemaphore   = false;
            return false;  
        });  
        // release ajax
        IWAjax.ajaxSemaphore   = false;
        return false;  
    },
    /**
     * Ajax Add new IntelliWidget Tab Section
     */
    add_tabbed_section = function (e){ 
        // don't allow add/delete section while saving
        if (true === IWAjax.ajaxSemaphore) return false;
        IWAjax.ajaxSemaphore   = true;
        // don't act like a link
        e.preventDefault();
        e.stopPropagation();
        
        // ignore click if we are in process
        if ($(this).hasClass('disabled')) return false;
        // disable the button until ajax returns
        $(this).addClass('disabled', true);
        // clear previous success/fail icons
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        // get id of button
        var container   = $(this).parent('.inside').find('.iw-tabbed-sections'),
            thisID      = container.prop('id'),
            // munge selector
            sel         = $(this),
            // get href from link
            href        = $(this).attr('href'),
            // build post data array from query string
            postData    = url_to_array(href);
        // show spinner
        $('#intelliwidget_spinner').show();
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_add';
        // send to wp
        // console.log(postData);
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                // console.log(response);
                sel.removeClass('disabled');
                $('#intelliwidget_spinner').hide();
                if ('fail' == response) {
                    $('.iw-copy-container').addClass('failure');
                } else {
                    form = $(response.form).hide();
                    tab  = $(response.tab).hide();
                    container.append(form);
                    if ('post' == IWAjax.objtype) bind_events(form);
                    container.find('.iw-tabs').append(tab);
                    tab.show();
                    container.tabs('refresh').tabs({active: tab.index()});
                    initTabs();
                    // show check mark
                    $('.iw-copy-container').addClass('success');
                }
                // release ajax
                IWAjax.ajaxSemaphore   = false;
                return false;  
            }, 'json'
        ).fail(function(){
            // console.log('fail');
            // release button
            sel.removeClass('disabled');
            // hide spinner
            $('#intelliwidget_spinner').hide();
            // show red X
            $('.iw-copy-container').addClass('failure');
            // release ajax
            IWAjax.ajaxSemaphore   = false;
            return false;  
        });  
        // release ajax
        IWAjax.ajaxSemaphore   = false;
        return false;  
    },
    /**
     * Ajax Delete IntelliWidget Tab Section
     */
    delete_tabbed_section = function (e){ 
        // don't allow add/delete section while saving
        if (true === IWAjax.ajaxSemaphore) return false;
        IWAjax.ajaxSemaphore   = true;
        // don't act like a link
        e.preventDefault();
        e.stopPropagation();
        
        // ignore click if we are in process
        if ($(this).hasClass('disabled')) return false;
        // disable the button until ajax returns
        $(this).addClass('disabled');
        // clear previous success/fail icons
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        // munge selectors
        var sel             = $(this),
            sectionform     = sel.parents('.iw-tabbed-section').first(),
            container       = sectionform.parent('.iw-tabbed-sections'),
            thisID          = sectionform.prop('id'),
            savecontainer   = sectionform.find('.iw-save-container'),
            // get box id 
            pre             = parse_ids(thisID),
            // get href from link
            href            = $(this).attr('href'),
            // build post data array from query string
            postData        = url_to_array(href);
        //console.log('thisID: ' + thisID + ' pre: ' + pre);
        // show spinner
        $('.intelliwidget_' + pre + '_spinner').show();
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_delete';
        // console.log(postData);
        // send to wp
        $.post(  
        // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                // console.log(response);
                sel.removeClass('disabled');
                $('.intelliwidget_' + pre + '_spinner').hide();
                if ('success' == response ) {
                        var survivor = sectionform.index();
                        sectionform.remove();
                        $('#iw_tab_' + pre).remove();
                        container.tabs('refresh');
                        initTabs();
                        //survivor -= target.parent('.iw-tabbed-sections').data('leftTabs').length;
                        container.tabs({active:survivor});
                } else {
                    savecontainer.addClass('failure');
                }
                // release ajax
                IWAjax.ajaxSemaphore   = false;
                return false;  
            }
        ).fail(function(){
            // console.log('fail');
            // release button
            sel.removeClass('disabled');
            // hide spinner
            $('.intelliwidget_' + pre + '_spinner').hide();
            savecontainer.addClass('failure');
            // release ajax
            IWAjax.ajaxSemaphore   = false;
            return false;  
        });  
        // release ajax
        IWAjax.ajaxSemaphore   = false;
        return false;  
    },
    /**
     * Ajax Fetch multiselect menus
     */
    get_menus = function (){ 
        $('.iw-copy-container,.iw-save-container,.iw-cdf-container').removeClass('success failure');
        var sectionform     = $(this).parents('.iw-tabbed-section').first(),
            // parse id to get section number
            thisID          = sectionform.prop('id'),
            // get section selector
            pre             = parse_ids(thisID),
            // get menu container
            menucontainer   = sectionform.find('#intelliwidget_' + pre + '_menus'),
            // get controls container selector
            savecontainer   = sectionform.find('.iw-save-container'),
            // get button selector
            savebutton      = sectionform.find('.iw-save'),
            // build post data array
            postData        = {};
        // only load once
        if (menucontainer.has('select').length) return false;
        // disable the button until ajax returns
        $(savebutton).prop('disabled', true);
        //menucontainer.hide();
        // show spinner
        $('.intelliwidget_' + pre + '_spinner').show();
        // find inputs for this section
        postData['iwpage'] = $('#iwpage').val();
        postData[IWAjax.idfield] = $('#' + IWAjax.idfield).val();
        // add wp ajax action to array
        postData['action'] = 'iw_' + IWAjax.objtype + '_menus';
        // find inputs for this section
        sectionform.find('input[type="hidden"]').each(
            function(index, element) {
            // get field id
            fieldID = $(this).attr('id');
            // add to post data
            postData[fieldID] = $(this).val();
        });
        //console.log(postData);
        // send to wp
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                //console.log(response);
                if ('fail' == response) {
                    // show red X
                    savecontainer.addClass('failure');
                } else {
                    // refresh menus
                    menucontainer.html(response);
                    //menucontainer.slideDown();
                    // show check mark
                    sectionform.find('.iw-save-container').addClass('success');
                }
                // release button
                savebutton.prop('disabled', false);
                // hide spinner
                $('.intelliwidget_' + pre + '_spinner').hide();
                return false;  
            }
        ).fail(function(){
            //console.log('FAIL :(');
            // release button
            savebutton.prop('disabled', false);
            // hide spinner
            $('.intelliwidget_' + pre + '_spinner').hide();
            // show red X
            savecontainer.addClass('failure');
            return false;  
        });  
        return false;  
    },

    /**
     * Ajax Fetch widget multiselect menus
     */
    get_widget_menus = function (){ 
        var sectionform     = $(this).parents('.widget').first(),
            // parse id to get section number
            thisID          = sectionform.find('.widget-id').val(),
            nonce           = $('#_wpnonce_widgets').val(),
            // get section selector
            pre             = 'widget-' + thisID,
            // get menu container
            menucontainer   = sectionform.find('#' + pre + '-menus'),
            // build post data array
            postData        = {};
        // only load once
        if (menucontainer.has('select').length) return false;
        // find inputs for this section
        postData['widget-id'] = thisID;
        postData['_wpnonce_widgets'] = nonce;
        // add wp ajax action to array
        postData['action'] = 'iw_widget_menus';
        // send to wp
        $.post(  
            // get ajax url from localized object
            IWAjax.ajaxurl,  
            //Data  
            postData,
            //on success function  
            function(response){
                if ('fail' == response) {
                    // show red X
                    //$(savecontainer).addClass('failure');
                } else {
                    // refresh menus
                    menucontainer.html(response);
                    //menucontainer.slideDown();
                    // show check mark
                    //$(sectionform).find('.iw-save-container').addClass('success');
                }
                // release button
                //$(savebutton).prop('disabled', false);
                // hide spinner
                //$('.' + pre + '_spinner').hide();
                return false;  
            }
        ).fail(function(){
            // release button
            //$(savebutton).prop('disabled', false);
            // hide spinner
            //$('.' + pre + '_spinner').hide();
            // show red X
            //$(savecontainer).addClass('failure');
            return false;  
        });  
        return false;  
    },

    /**
     * nice little url -> name:value pairs codex
     */
    url_to_array = function(url) {
        var pair, i, request = {},
            pairs = url.substring(url.indexOf('?') + 1).split('&');
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return request;
    },
    // set visible timestamp and timestamp hidden inputs to form inputs 
    // only validates form if validate param is true
    // this allows values to be reset/cleared
    iwUpdateTimestampText = function(field, validate) {
        // retrieve values from form
        var attemptedDate, 
            div         = '#' + field + '_div', 
            clearForm   = (!validate && !$('#'+field).val()),  
            aa          = $('#'+field+'_aa').val(),
            mm          = ('00'+$('#'+field+'_mm').val()).slice(-2), 
            jj          = ('00'+$('#'+field+'_jj').val()).slice(-2), 
            hh          = ('00'+$('#'+field+'_hh').val()).slice(-2), 
            mn          = ('00'+$('#'+field+'_mn').val()).slice(-2),
            og          = $('#'+field+'_og').val();
        if (! $(div).length) return true;
        // construct date object
        attemptedDate = new Date( aa, mm - 1, jj, hh, mn );
        // validate inputs by comparing to date object
        if ( attemptedDate.getFullYear() != aa || 
            (1 + attemptedDate.getMonth()) != mm || 
            attemptedDate.getDate() != jj ||
            attemptedDate.getMinutes() != mn ) {
            // date object returned invalid
            // if validating, display error and return invalid
                if (true == validate && !og) {
                    $(div).addClass('form-invalid');
                    $('.iw-cdfsave').prop('disabled', true);
                    return false;
                }
                // otherwise clear form (value is/was null)  
                clearForm = true;
        }
        // date validated or ignored, reset invalid class
        $(div).removeClass('form-invalid');
        
        $('.iw-cdfsave').prop('disabled', false);
        if (clearForm) {
            // replace date fields with empty string
            if (! og) $('#'+field+'_timestamp').html('');
            $('#'+field).val('');
        } else {
            // format displayed date string from form values
            if ('intelliwidget_expire_date' == field) {
                $('#intelliwidget_ongoing').val($('#'+field+'_og').is(':checked') ? 1 : 0);
                if ($('#'+field+'_og').is(':checked')) {
                    $('#'+field+'_timestamp').html($('#intelliwidget_ongoing_label').text());
                    $('#'+field).val('');
                    return true;
                }
            }
            $('#'+field+'_timestamp').html(
                '<b>' +
                $('option[value="' + $('#'+field+'_mm').val() + '"]', '#'+field+'_mm').text() + ' ' +
                jj + ', ' +
                aa + ' @ ' +
                hh + ':' +
                mn + '</b> '
            );
            // format date field from form values
            $('#'+field).val(
                aa + '-' +
                $('#'+field+'_mm').val() + '-' +
                jj + ' ' +
                hh + ':' +
                mn                    
            );
        }
        return true;
    };
    /* END OF FUNCTIONS
     *
     * START EVENT BINDINGS (delegate where posible)
     */
    // if panels were open before ajax save, reopen
    $(document).ajaxComplete(refreshOpenPanels);
    $('.iw-tabbed-sections').tabs({ active: ($('iw-tab').length - 1) });
    // for object types other than post we can delegate postbox collapse behavior once on load
    // postbox bindings on edit post/page must be refreshed using bind_events() after refresh
    if ('post' != IWAjax.objtype) {
        $('body').on('click', '.iw-collapsible > .handlediv, .iw-collapsible > h4, .iw-collapsible > h3', function(e) {
            e.stopPropagation();
            var p = $(this).parent('.postbox'), 
                //id = p.attr('id'),
                sectionform = $(this).parents('div.widget, div.iw-tabbed-section').first();
            p.toggleClass('closed')
                //.find('#' + id + '-inside')
                //.stop().slideToggle(function(){});
            updateOpenPanels(sectionform);
        });
    }
    $('body').on('click', '.iw-tabbed-sections .panel-selection h3, .iw-tabbed-sections .panel-selection .handlediv', get_menus);
    $('body').on('click', '.widget-inside .panel-selection h4, .widget-inside .panel-selection .handlediv', get_widget_menus);
    // bind click events to edit page meta box buttons
    $('body').on('click', '.iw-save', save_postdata);    
    $('body').on('click', '.iw-cdfsave', save_cdfdata);    
    $('body').on('click', '.iw-copy', copy_profile);    
    $('body').on('click', '.iw-add', add_tabbed_section);    
    $('body').on('click', '.iw-delete', delete_tabbed_section);
    // update visibility of form inputs
    $('body').on('change', '.iw-control', save_postdata);    
    $('body').on('change', '.iw-widget-control', function(e){
        var sectionform = $(this).parents('div.widget').first();
        updateOpenPanels(sectionform);
        wpWidgets.save( sectionform, 0, 0, 0 );
    });    
    
    /**
     * manipulate IntelliWidget timestamp inputs
     * Adapted from wp-admin/js/post.js in Wordpress Core
     */
     
    // format visible timestamp values
    iwUpdateTimestampText('intelliwidget_event_date', false);
    iwUpdateTimestampText('intelliwidget_expire_date', false);
    
    // bind edit links to reveal timestamp input form
    $('body').on('click', 'a.intelliwidget-edit-timestamp', function() {
        var field = $(this).attr('id').split('-', 1);
        if ($('#'+field+'_div').is(":hidden")) {
            $('#'+field+'_div').slideDown('fast');
            $('#'+field+'_mm').focus();
            $(this).hide();
        }
        return false;
    });
    // bind click to clear timestamp (resets form to current date/time and clears date fields)
    $('body').on('click', '.intelliwidget-clear-timestamp', function() {
        var field = $(this).attr('id').split('-', 1);
        $('#'+field+'_div').slideUp('fast');
        $('#'+field+'_mm').val($('#'+field+'_cur_mm').val());
        $('#'+field+'_jj').val($('#'+field+'_cur_jj').val());
        $('#'+field+'_aa').val($('#'+field+'_cur_aa').val());
        $('#'+field+'_hh').val($('#'+field+'_cur_hh').val());
        $('#'+field+'_mn').val($('#'+field+'_cur_mn').val());
        $('#'+field+'_og').prop('checked', false);
        $('#'+field+'_timestamp').html('');
        $('#'+field).val('');
        $('a#'+field+'-edit').show();
        iwUpdateTimestampText(field, false);
        return false;
    });
    // bind cancel button to reset values (or empty string if orig field is empty) 
    $('body').on('click', '.intelliwidget-cancel-timestamp', function() {
        var field = $(this).attr('id').split('-', 1);
        $('#'+field+'_div').slideUp('fast');
        $('#'+field+'_mm').val($('#'+field+'_hidden_mm').val());
        $('#'+field+'_jj').val($('#'+field+'_hidden_jj').val());
        $('#'+field+'_aa').val($('#'+field+'_hidden_aa').val());
        $('#'+field+'_hh').val($('#'+field+'_hidden_hh').val());
        $('#'+field+'_mn').val($('#'+field+'_hidden_mn').val());
        $('#'+field+'_og').prop('checked', $('#'+field+'_hidden_og').val() ? true : false);
        $('a#'+field+'-edit').show();
        iwUpdateTimestampText(field, false);
        return false;
    });

    // bind 'Ok' button to update timestamp to inputs
    $('body').on('click', '.intelliwidget-save-timestamp', function () { 
        var field = $(this).attr('id').split('-', 1);
        if ( iwUpdateTimestampText(field, true) ) {
            $('#'+field+'_div').slideUp('fast');
            $('a#'+field+'-edit').show();
        }
        return false;
    });
    // bind right and left scroll arrows
    $('.iw-tabbed-sections').on('click', '.iw-larr, .iw-rarr', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).is(':visible')) {
            if ($(this).hasClass('iw-larr')) rightShiftTabs($(this));
            else leftShiftTabs($(this));
        }
    });
    // reflow tabs on resize
    $(window).resize(reflowTabs);
    // END EVENT BINDINGS
    // reveal intelliwidget sections
    $('.iw-tabbed-sections').slideDown();
    // set up tabs
    initTabs();
});
