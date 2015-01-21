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
var wh=parseUri(window.location);
var whUrl=wh.protocol+'://'+wh.host+wh.directory;           

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    if (str && typeof str !=="undefined"){
      return this.slice(0, str.length) == str;
    }else{
      return false;
    }
  };
}
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    if (str && typeof str !=="undefined"){
      return this.slice(-str.length) == str;
    }else{
      return false;
    }
  };
}
/**
 *  Get the localized string for the specified key.
 */
function getLocalization(localizationKey) {
	if (localization[localizationKey]){
		return localization[localizationKey];
	}else{
		return localizationKey;
	}
}
/**
 * Hide and show div-s
 */
 
function showMenu(displayTab){
    parent.termsToHighlight = Array();
    var contentLinkText = getLocalization("Content");
    var searchLinkText = getLocalization("Search");
    var indexLinkText = getLocalization("Index");
    var tabs = document.getElementById('tocMenu').getElementsByTagName("div");
    for (var i = 0 ; i < tabs.length; i++){
        var currentTabId = tabs[i].id;
        // generates menu tabs        
        document.getElementById(currentTabId).innerHTML = '<span onclick="showMenu(\'' + currentTabId + '\')">' + eval(currentTabId + "LinkText") + '</span>';
        
        // show selected block
        selectedBlock = displayTab + "Block";
        if (currentTabId == displayTab){
            document.getElementById(selectedBlock).style.display = "block";
            $('#' + currentTabId).addClass('selected');
        } else  {
            document.getElementById(currentTabId + 'Block').style.display = "none";
            $('#' + currentTabId).removeClass('selected');
         }   
    }
	if (displayTab == 'content') {        
            expandToTopic(parent.contentwin.location.href);        
    }
   
    if (displayTab == 'search') {
        $('.textToSearch').focus();
    }
    if (displayTab == 'index') {
        $('#id_search').focus();
    }
  //  $('*', window.parent.contentwin.document).unhighlight();
} 

 
function hideDiv(hiddenDiv,showedDiv){   
    parent.termsToHighlight = Array();
    document.getElementById(hiddenDiv).style.display = "none";
    document.getElementById(showedDiv).style.display = "block";
    var contentLinkText = getLocalization("Content");
    var searchLinkText = getLocalization("Search");
    
	if (hiddenDiv == 'searchDiv') {
		document.getElementById('divContent').innerHTML = '<font class="normalLink">' + contentLinkText + '</font>';
		document.getElementById('divSearch').innerHTML = '<a href="javascript:void(0);" class="activeLink" id="searchLink" onclick="hideDiv(\'displayContentDiv\',\'searchDiv\')">' + searchLinkText + '</a>';
        expandToTopic(window.location.href);
    } else {
		document.getElementById('divContent').innerHTML = '<a href="javascript:void(0);" class="activeLink" id="contentLink" onclick="hideDiv(\'searchDiv\',\'displayContentDiv\')">' + contentLinkText + '</a>';
		document.getElementById('divSearch').innerHTML = '<font class="normalLink">' + searchLinkText + '</font>';
	}
    
  //  $('*', window.parent.contentwin.document).unhighlight();
}

/**
 * Opens a page (topic) file and highlights a word from it.
 */
function openAndHighlight(page, words, linkName){
    var links = document.getElementsByTagName('a');
    for (var i = 0 ; i < links.length ; i++){
        if (links[i].id == linkName ){
            document.getElementById(linkName).className = 'otherLink';
        } else if (links[i].id.startsWith('foundLink')) {
            document.getElementById(links[i].id).className = 'foundResult';
        }
    }
    
	parent.termsToHighlight = words;
	parent.frames['contentwin'].location = page;	
}


function stripUri(uri){
  var toReturn="";
      
  var ret=new Array();
  if (typeof uri !=="undefined"){
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
}
  log.info('stripUri('+uri+')='+toReturn);
  return toReturn;
}           
function normalizeLink(origLink){   
  log.info('normalizeLink(',origLink);
  if (origLink!=""){
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
      log.debug('ie7 file://');
      relLink=origLink.substring(whUrl.length);
    }
  }else{
    if (relLink.startsWith(whUrl)){
      relLink=relLink.substr(whUrl.length);
    }
  }
  var toReturn=stripUri(relLink);
  log.info(logStr+'normalizeLink('+origLink+')='+toReturn);
  return toReturn;
  }else{
    log.info(logStr+'normalizeLink('+origLink+')='+"\"\"");
  return "";
  }
}

function expandToTopic(url){
  log.debug('expandToTopic(',url);
  url=normalizeLink(url);
  if (url.startsWith('../')){
    url=url.substr(url.lastIndexOf('../')+3);
  }
  
  var relp=window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'));
  log.debug('relp:'+relp);
  var toFind=url;
    log.debug('expandToTopic('+toFind+') - loaded');
  
    var loc='#contentBlock a[href^="'+toFind+'"]';
    log.info('search:'+toFind);  
    toggleItem($(loc).parent(),true);
    $('#contentBlock li a').removeClass('menuItemSelected');
    $(loc).addClass('menuItemSelected');
}
function redirect(link){
  log.debug('redirect('+link+');');
  window.parent.contentwin.location.href = link;
}
        function toggleItem(loc,forceOpen){
  log.debug('toggleItem('+loc.prop("tagName")+', '+forceOpen+')');
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
 
}
 
  
$(document).ready(function(){
$('#contentBlock li a').each(function(){
    var old=$(this).attr('href');         
    if (old=='javascript:void(0)'){          
      $(this).attr('href','#!_'+$(this).text());
    }else{
      $(this).attr('href',normalizeLink(old));
      log.info('alter link:'+$(this).attr('href')+' from '+old);
    }
  });
  
  $('#contentBlock li>span').click(function (){
    toggleItem($(this));
  })
            
  $('#contentBlock li a').click(function(){
      toggleItem($(this).parent(),true);
    if ($(this).attr('href').indexOf('#!_')==0){
    // do nothing
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
  log.info('loaded!..');
  $('#preload').hide();
  });
 