/*
 *  The Syncro Soft SRL License
 *
 *  Copyright (c) 1998-2012 Syncro Soft SRL, Romania.  All rights
 *  reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *  1. Redistribution of source or in binary form is allowed only with
 *  the prior written permission of Syncro Soft SRL.
 *
 *  2. Redistributions of source code must retain the above copyright
 *  notice, this list of conditions and the following disclaimer.
 *
 *  3. Redistributions in binary form must reproduce the above copyright
 *  notice, this list of conditions and the following disclaimer in
 *  the documentation and/or other materials provided with the
 *  distribution.
 *
 *  4. The end-user documentation included with the redistribution,
 *  if any, must include the following acknowledgment:
 *  "This product includes software developed by the
 *  Syncro Soft SRL (http://www.sync.ro/)."
 *  Alternately, this acknowledgment may appear in the software itself,
 *  if and wherever such third-party acknowledgments normally appear.
 *
 *  5. The names "Oxygen" and "Syncro Soft SRL" must
 *  not be used to endorse or promote products derived from this
 *  software without prior written permission. For written
 *  permission, please contact support@oxygenxml.com.
 *
 *  6. Products derived from this software may not be called "Oxygen",
 *  nor may "Oxygen" appear in their name, without prior written
 *  permission of the Syncro Soft SRL.
 *
 *  THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 *  WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED.  IN NO EVENT SHALL THE SYNCRO SOFT SRL OR
 *  ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 *  USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 *  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 *  SUCH DAMAGE.
 */
function debug(msg,obj){      
  log.debug(msg,obj);     
}

function info(msg,obj){      
  log.info(msg,obj);     
}

function error(msg,obj){      
  log.error(msg,obj);     
}

function warn(msg,obj){      
  log.warn(msg,obj);     
}

var iframeDir="";
var wh=parseUri(window.location);
var whUrl=wh.protocol+'://'+wh.authority+wh.directory;
var islocal=wh.protocol=='file';
var pageName=wh.file;    
var loaded=false;
var ws=false;
var searchedWords="";
var resizeTimer;
var lastLoadedPage="";            
var showAll=true;
var currentReq=null;

var showTooltip = function(event) {
  $('div.tooltip').remove();   
  $('<div id="tootltipNew" class="tooltip"></div>').appendTo('body');
  $('#tootltipNew').html($(this).find('>a').attr('title'));
  changeTooltipPosition(event);
};
var changeTooltipPosition = function(event) {
  var tooltipX = event.pageX;    
  var tooltipY = event.pageY + 20;      
  $('div.tooltip').css({
    top: tooltipY, 
    left: tooltipX
  });
};
var hideTooltip = function() {
  $('div.tooltip').remove();
};
/**
 * Redirect browser to a new address
 */
function redirect(link){
  debug('redirect('+link+');');
  window.location.href = link;
}

if (location.search.indexOf("?q=")==0){
  debug('search:'+location.search+' hwDir:'+wh.directory);
  var pos=0;
  var newLink=whUrl+pageName;
  if (islocal){
    pos=location.search.lastIndexOf(wh.directory.substring(1));
    newLink=newLink+"#"+location.search.substring(pos+wh.directory.length-1);
  }else{
    pos=location.search.lastIndexOf(wh.directory);
    newLink=newLink+"#"+location.search.substring(pos+wh.directory.length);
  }
  debug('redirect to '+newLink);
  redirect(newLink);
}

debug('<hr> Load Window....');
debug('var whUrl:'+whUrl);
debug('var islocal:'+islocal);
debug('var pageName:'+pageName);
debug('browser:'+navigator.userAgent);
debug('os:'+navigator.appVersion);

/**
 * get translated messages
 */ 
function getLocalization(localizationKey) {
  var toReturn=localizationKey;
  if((localizationKey in localization)){
    toReturn=localization[localizationKey];
  }
  debug('getLocalization('+localizationKey+')='+toReturn);
  return toReturn;
}
/**
 * Highlight Search Terms in right frame , but for Chrome when is opened localy
 */ 
function highlightSearchTerm(words){
  if (verifyBrowser()){
    if(words != null){
      // highlight each term in the content view  
      $('#frm').contents().find('body').removeHighlight();
      for(i = 0 ; i < words.length ; i++){        
        debug('highlight('+words[i]+');');
        $('#frm').contents().find('body').highlight(words[i]);
      }
    }
  }else{
  // 
  }
}
      
      
/**
       * Opens a page (topic) file and highlights a word from it.
       */
function openAndHighlight(page, words, linkName){
  searchedWords=words;
  debug('openAndHighlight('+page+','+words.join(':')+','+linkName+');');
  if (page!=lastLoadedPage){
  redirect(pageName+'#'+page);
  }else{
    highlightSearchTerm(searchedWords);
  }
  return false;
}  
 
var tabsInitialized=false;
function initTabs(){
  if (!tabsInitialized){
  var contentLinkText = getLocalization("Content");
  var searchLinkText = getLocalization("Search");
  var indexLinkText = getLocalization("Index");
  var tabs = new Array("content","search","index");
  for (var i = 0 ; i < tabs.length; i++){    
    var currentTabId = tabs[i];
    // generates menu tabs        
    if (document.getElementById(currentTabId)){
    info('Init tab with name: '+currentTabId);    
      document.getElementById(currentTabId).innerHTML = '<span onclick="showMenu(\'' + currentTabId + '\')">' + eval(currentTabId + "LinkText") + '</span>';    
    }else{
      info('init no tab found with name: '+currentTabId);
    }
  tabsInitialized=true;
  }
}
}
/**
       * Hide and show div-s
       */
function showMenu(displayTab){
  debug('showMenu('+displayTab+');');
  parent.termsToHighlight = Array();
  initTabs();
  var tabs = new Array("content","search","index");
  for (var i = 0 ; i < tabs.length; i++){
    var currentTabId = tabs[i];
    // generates menu tabs        
    if (document.getElementById(currentTabId)){
    // show selected block
    selectedBlock = displayTab + "Block";
    if (currentTabId == displayTab){
      document.getElementById(selectedBlock).style.display = "block";
      $('#' + currentTabId).addClass('selectedTab');
    } else  {
      document.getElementById(currentTabId + 'Block').style.display = "none";
      $('#' + currentTabId).removeClass('selectedTab');
    }   
  }
  }
  if (displayTab == 'content') {
    searchedWords="";
  }   
  if (displayTab == 'search') {
    $('.textToSearch').focus();
    searchedWords=$('#textToSearch').text();        
  }
  if (displayTab == 'index') {
    $('#id_search').focus();
    searchedWords="";
  }
  toggleLeft();
  
} 



$(function(){
  $(window).hashchange( function(){
    var hash = location.hash;
    debug('hashchange('+hash+');');
    load(window.location.href);    
  });
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).hashchange();
  
});

function showScrolls(){
  var w=$('#leftPane').width();
  var bckTH=$('#bck_toc').height();
  var leftPH=$('#leftPane').height();
  debug('showScrolls() w='+w+' bckTH='+bckTH+' leftPH='+leftPH);
  if (w>0){
    if (bckTH>leftPH){
      $('#leftPane').css('overflow-y','scroll');         
    }else{
      $('#leftPane').css('overflow-y','auto');
    }
  }else if (w==0){
    $('#leftPane').css('overflow-y','hidden');
  }else{      
    $('#leftPane').css('overflow-y','auto');
  }
}
/**
 *
 * Toggle item selected item
 * 
 */
function toggleItem(loc,forceOpen){
  debug('toggleItem('+loc.prop("tagName")+', '+forceOpen+')');
  $(loc).parent().parents('#contentBlock li').find('>span').addClass('hasSubMenuOpened');
  $(loc).parent().parents('#contentBlock li').find('>span').removeClass('hasSubMenuClosed');
  if (loc.hasClass('hasSubMenuOpened') && !(forceOpen==true)){
    if ($(loc).parent().find('>ul').size()>0){
      $(loc).removeClass('hasSubMenuOpened');    
      $(loc).addClass('hasSubMenuClosed');
      $(loc).parent('#contentBlock li').find('>ul').hide();
    }
  }else{
    if ($(loc).parent().find('>ul').size()>0){
      $(loc).addClass('hasSubMenuOpened');    
      $(loc).removeClass('hasSubMenuClosed');        
      $(loc).parent('#contentBlock li').find('>ul').show();
    }
    $(loc).parent().parents('#contentBlock li').find('>ul').show();
  }
  showScrolls();
}
function resizeContent() {
  var heightScreen=$(window).height();
  var hh=$('#header').height();
  var splitterH=heightScreen-hh-3;
  debug('resizeContent() hh='+hh+' hs='+heightScreen);
  $('#splitterContainer').height(splitterH);
  $('div.tooltip').remove();
  if ($(window).width()>=800){
    debug('Deactivate tooltip');    
    $(".navparent a,.navprev a,.navnext a").show();  
    $(".navparent,.navprev,.navnext").unbind({
      mousemove : changeTooltipPosition,
      mouseenter : showTooltip,
      mouseleave: hideTooltip
    }); 
  }else{
    debug('Activate tooltip');    
    $(".navparent a,.navprev a,.navnext a").hide();       
    $(".navparent,.navprev,.navnext").bind({
      mousemove : changeTooltipPosition,
      mouseenter : showTooltip,
      mouseleave: hideTooltip
    }); 
  }
};

if (("onhashchange" in window) && !($.browser.msie)) { 
} else {
  //IE and browsers that don't support hashchange
  $('#contentBlock a').bind('click', function() {
    var hash = $(this).attr('href');
    debug('#contentBlock a click('+hash+')');
    load(hash);        
  });
}
    

$(window).resize(function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeContent, 10);
});    
    
function processHref(hrf){   
  var pp=parseUri(hrf);   
  var newD=pp.host+pp.directory+pp.file;
  debug('parseUri('+hrf+')='+pp.host+'+'+pp.directory+'+'+pp.file);
  if (pp.directory=="" && pp.file==""){
    newD=iframeDir+pp.host;
  }else{
    if (pp.file!=""){
      if (newD.indexOf('../../')==0){
        newD=newD.substring(6);
      }else{
        if (newD.indexOf('../')==0){
          newD=newD.substring(3);       
        }else{
        }
      }
    }else{
    //
    }
  }
  if (pp.anchor!=""){
    newD=newD+"#"+pp.anchor;
  }
  debug('processHref('+hrf+')='+newD);
  return newD;
}  
    
function markSelectItem(hrl,startWithMatch){
  debug('markSelectItem('+hrl+','+startWithMatch+')');
$('#contentBlock li a').removeClass('menuItemSelected');
  if (startWithMatch == null || typeof startWithMatch === 'undefined'){
    startWithMatch=false;
    debug('forceMatch - false');
  }
  var toReturn=false;  
  if (loaded){
    var loc='#contentBlock a[href="#'+hrl+'"]';
    if (startWithMatch){
      loc='#contentBlock a[href^="#'+hrl+'#"]';
    }
    if ($(loc).length!=0){
    toggleItem($(loc).parent(),true);
    if (hrl.indexOf("!_")==0){
    // do not mark selected - fake link found     
    }else{
      $('#contentBlock li a').removeClass('menuItemSelected');
      var item=$(loc);
      item.addClass('menuItemSelected'); 
        
      if (item.offset()!=null){
        var container = $('#leftPane');
        
        if ((item.offset().top<=container.offset().top)||(item.offset().top>=container.height())){          
          var iTop=item.offset().top;
          var cTop=container.offset().top;
          var cScrollTop=container.scrollTop();
          debug('container.scrollTop('+iTop+' - '+cTop+' + '+cScrollTop+')');
          container.scrollTop(iTop - cTop + cScrollTop);
        }                
      }
    }
     toReturn=true;
  }
}
  debug('markSelectItem(...) ='+toReturn);
  return toReturn;
}
    
/**
 * Load new page in content window
 */
function load(link){
  debug('load link:'+link);
  var hash="";
  if (link.indexOf("#")>0){
    hash=link.substr(link.indexOf("#")+1);
  }        
  if (hash==''){
    $('#contentBlock li a').each(function (index, domEle) {
      if ($(this).attr('href').indexOf('#!_')!=0){
        link=pageName+$(this).attr('href');
        debug('Found first link from toc');
        return false;
      }
    });
  }
          
  if (link.indexOf("#")>0 || pageName==''){
    var hr=link.substr(link.indexOf("#"));
    hr=hr.substring(1);		
    var hrl=hr;
    if (hr.indexOf("#")>0){
      hrl=hr.substr(0,hr.indexOf("#"));
    }
    if (!markSelectItem(hr)){
      if (!markSelectItem(hrl)){
        markSelectItem(hr,true);
    }
    }
    if (hr.indexOf("!_")==0){
    //fake link found 
    }else{
      if (hr && (hr!=lastLoadedPage)){        
        lastLoadedPage=hr;
        debug('lastLoadedPage='+hr);
        loadIframe(hr);
        var p=parseUri(hr);
        debug('load: parseUri(hr)=',p);        
        iframeDir=p.host+p.directory;
        if (p.protocol=='' && p.path=='' && p.directory==''){
          iframeDir='';
        } 
        debug('iframeDir='+p.host+'+'+p.directory);
            
      }else{	
      //already loaded
      }
    } //has hash
  }
}
function toggleLeft(){
  var widthLeft=$('#leftPane').css('width')
  widthLeft=widthLeft.substr(0, widthLeft.length-2);    
  debug('toggleLeft() - left='+widthLeft);
  if (Math.round(widthLeft)<=0){
    $("#splitterContainer .splitbuttonV").trigger("mousedown"); //trigger the button    
    if ($("#splitterContainer .splitbuttonV").hasClass('invert')){
      $("#splitterContainer .splitbuttonV").removeClass('invert');  
    
    }
    if (!$("#splitterContainer .splitbuttonV").hasClass('splitbuttonV')){
      $("#splitterContainer .splitbuttonV").addClass('splitbuttonV');
    }    
  }
}

function parentLoad(hash){
  debug('parentLoad('+hash+')');
  window.location.href=whUrl+hash;
}

// return false if browser is Google Chrome and WebHelp is used on a local machine, not a web server 
function verifyBrowser(){
  var returnedValue = true;    
  var browser = BrowserDetect.browser;
  var addressBar = window.location.href;
  if (browser == 'Chrome' && addressBar.indexOf('file://') === 0){
    returnedValue = false;
  }
  debug('verifyBrowser()='+returnedValue);
  return returnedValue;
}
    
function loadIframe(dynamicURL){
  debug('loadIframe('+dynamicURL+')');
  var anchor="";
  if (dynamicURL.indexOf("#")>0){
    //anchor
    anchor=dynamicURL.substr(dynamicURL.indexOf("#"));
    anchor=anchor.substr(1);
  }
      
  $('#frm').remove();
  var iframeHeaderCell = document.getElementById('rightPane');
  var iframeHeader = document.createElement('IFRAME');
  iframeHeader.id = 'frm';
  iframeHeader.src = dynamicURL ;
  /*iframeHeader.width = ...;
        iframeHeader.height = ...;
        iframeHeader.scrolling = 'no';
         */
  iframeHeader.frameBorder = 0;
  iframeHeader.align = 'center';
  iframeHeader.valign='top'
  iframeHeader.marginwidth = 0;
  iframeHeader.marginheight = 0;
  iframeHeader.hspace = 0;
  iframeHeader.vspace = 0;
    
  iframeHeader.style.display = 'none';
  iframeHeaderCell.appendChild(iframeHeader);
  $('#frm').load(function(){
    debug('#frm.load');
    if (verifyBrowser()){
      debug('#frm.load 1');
      $('#frm').contents().find('.navfooter').before('<div style="border-top: 1px solid #EEE;"><!-- --></div>').hide();
      $('#frm').contents().find('.frames').hide();
      $('#frm').contents().find('.title').css('background','#fff');
      $('#frm').contents().find('.title').css('box-shadow','none');
      
      $('#frm').contents().find('a').click(function(ev){
        var hrf=$(this).attr('href');
        var p =parseUri(hrf);
        if(p.protocol != '' ){
         window.open(hrf, '', '') ;
        }else{         
        var newUrl=pageName+location.search+'#'+processHref(hrf);
        //console.log('##alert: '+hrf+" = "+newUrl);
        parentLoad(newUrl);        
        ev.preventDefault();
        }
        return false;            
      });
    }
      
    if (verifyBrowser()){
      debug('#frm.load 2');      
      $('#navigationLinks').html($('#frm').contents().find('div.navheader .navparent, div.navheader .navprev, div.navheader .navnext'));      
      $('#frm').contents().find('div.navheader').hide();
      $('#frm').contents().find('.toc').hide();
      $('#breadcrumbLinks').html($('#frm').contents().find('table.nav a.navheader_parent_path'));
      $('#frm').contents().find('table.nav').hide();
    }    
    $('#frm').show();
    $('div.tooltip').remove();
    $(".navparent,.navprev,.navnext").bind({
      mousemove : changeTooltipPosition,
      mouseenter : showTooltip,
      mouseleave: hideTooltip
    });      
    $('#breadcrumbLinks').find('a').after('<span>&nbsp;/&nbsp;</span>');    
    $('#breadcrumbLinks').find('span').last().html('&nbsp;&nbsp;');
    $('.navparent,.navprev,.navnext').prepend('&nbsp;');
    $('.navparent').click(function(){
      $(this).find('>a').click();
    });
    $('.navprev').click(function(){
      $(this).find('>a').click();
    });
    $('.navnext').click(function(){
      $(this).find('>a').click();
    });
    
    $('#productToolbar .navheader_linktext').each(function(){
      if ($(this).text().length>30){        
        $(this).text($(this).text().substr(0,30)+"...");
      }
    });      
    $('#productToolbar .navheader_parent_path').each(function(){
      if ($(this).text().length>30){
        $(this).text($(this).text().substr(0,30)+"...");
      }
    });
          
    highlightSearchTerm(searchedWords);              
    resizeContent();
  });    
}
$(window).ready(function(){
  toggleLeft();
})
    
function showDivs(){
  debug('showDivs()');
  if (!showAll){
    $('#list_idx').html("");
    $("#indexList").show();
    $("#indexList div").show();
    showAll=true;
  }
  showScrolls();
}
      
function normalizeLink(origLink){                            
  var relLink=origLink;
  var logStr='';  
  if (!$.support.hrefNormalized){
    var relp=window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'));
    //ie7
    logStr=' IE7 ';
    var srv=window.location.protocol+'//'+window.location.hostname;    
    var localHref=parseUri(origLink);
              
    if (window.location.protocol.toLowerCase()!='file:' 
      && localHref.protocol.toLowerCase()!=''){            
      debug('ie7 file://');
      relLink=origLink.substring(whUrl.length);
    }
  }
  var toReturn=stripUri(relLink);
  info(logStr+'normalizeLink('+origLink+')='+toReturn);
  return toReturn;
}
      
function stripUri(uri){
  var toReturn='';
  
  var ret=new Array();
  var bar = uri.split("/");
  var reti=-1;
  var i=bar.length;
  for (var i=bar.length; i>0; i--){
    if (bar[i]=='..'){          
      for (var j=i-1; j>0; j--){
        if (bar[j]!='..' && bar[j]!=''){
          bar[j]='';
          bar[i]='';
          break;
        }
      }
    }
  }
  for(var i=0;i<bar.length;i++){
    if (bar[i]!=''){
      toReturn=toReturn+bar[i];
      if (i<bar.length-1){
        toReturn=toReturn+'/';
      }
    }else{
      if (i==0){
        toReturn=toReturn+'/';
      }
    }
  }
  info('stripUri('+uri+')='+toReturn);
  return toReturn;
}      
  
  if (location.search.indexOf('?log=true')>=0){
    log.setLevel(0);    
  }
  
$(document).ready(function() {
  $("#splitterContainer").splitter({
    minAsize : 0,
    maxAsize : 600,                    
    splitVertical : true,
    A : $('#leftPane'),
    B : $('#rightPane'),
			
    closeableto : 0,
    animSpeed: 100
  });
        
  if (!verifyBrowser()){
    // using Chrome to read local files
    redirect('index_frames.html');
  }else{
  $('#frm').unload(function(ev){
    ////console.log('exitt');
    ev.preventDefault();
    return false;
  });          
//  $('#contentBlock li a').wrap('<span/>');
  
  $('#contentBlock li a').each(function(){
    var old=$(this).attr('href');         
    if (old=='javascript:void(0)'){          
      $(this).attr('href','#!_'+$(this).text());
    }else{
      $(this).attr('href','#'+normalizeLink(old));
      info('alter link:'+$(this).attr('href')+' from '+old);
    }
  });
      
  $('#contentBlock li>span').click(function (){
    toggleItem($(this));
  })
            
  $('#contentBlock li a').click(function(){
    if ($(this).attr('href').indexOf('#!_')==0){
    // do nothing
      toggleItem($(this));
    }else{
      $('#contentBlock li a').removeClass('menuItemSelected');
      $(this).addClass('menuItemSelected');
      redirect($(this).attr('href'));
    }    
    return false;
  });  
      
  $('#contentBlock li>span').each(function(){
    if ($(this).parent().find('>ul').size()>0){
      $(this).addClass('hasSubMenuClosed');                        
    }else{
      $(this).addClass('topic');
    }                    
  })
        
  loaded=true;
  load(window.location.href);
  resizeContent();
  
  showMenu('content');
  
  $('#iList a').each(function(){
    var old=$(this).attr('href');
    $(this).attr('href','#'+normalizeLink(old));         
    $(this).removeAttr('target');
  }); 
  $('.tab').click(function(){
    showMenu($(this).attr('id'));   
  });  
  }  
});  


  