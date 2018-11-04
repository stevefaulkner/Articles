function setCookie(strName, strValue)
{
	var objDate = new Date();
	
	// Set expiration as 1 year in seconds
	objDate.setTime(objDate.getTime() + 31536000);

	document.cookie = strName + '=' + strValue + '; expires=' + objDate.toGMTString() + '; path=/';
}


function isString(strValue)
{
	return (typeof strValue === 'string' && strValue !== '' && isNaN(strValue));
}

function isEmail(strValue)
{
	var objRE = /^[\w\-\.\']{1,}\@([\da-zA-Z\-]{1,}\.){1,}[\da-zA-Z\-]{2,}$/;

	return (strValue !== '' && objRE.test(strValue));
}

function isURL(strValue)
{
	var objRE = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

	return (strValue !== '' && objRE.test(strValue));
}

function toggleStyle(objAnchor)
{
	var strLinkPhrase = objAnchor.firstChild.data;
	var objNewNode;

	if (strLinkPhrase === 'Switch to High Contrast')
	{
		objNewNode = document.createTextNode('Switch to Regular Layout');
		objAnchor.replaceChild(objNewNode, objAnchor.firstChild);
		objAnchor.title = 'Switch the current style sheet to the default style sheet';
		setCookie("style", "alt");
	}
	else
	{
		objNewNode = document.createTextNode('Switch to High Contrast');
		objAnchor.replaceChild(objNewNode, objAnchor.firstChild);
		objAnchor.title = 'Switch the current style sheet to a high contrast style sheet';
		setCookie("style", "regular");
	}

	for(var j=0; j<document.styleSheets.length; j++)
	{
		if (document.styleSheets[j].title)
		{
			document.styleSheets[j].disabled = !document.styleSheets[j].disabled;
		}
	}

	return false;
}

function addStyleEvents()
{
	var objAnchor = document.getElementById("togstyle");

	if (objAnchor)
	{
		objAnchor.onclick = function(){return toggleStyle(this);};
	}

	return true;
}

function addIETabOrder()
{
	var objHeadings = document.getElementsByTagName('h2');
	
	for (var iCounter=0; iCounter<objHeadings.length; iCounter++)
	{
		objHeadings[iCounter].tabIndex = -1;
	}
}

function isNested(objElement)
{
	var objParent = objElement;
	do
	{
		objParent = objParent.parentNode;
		if (objParent.tagName && objParent.tagName.toLowerCase() == 'q')
		{
			return true;
		}
	} while (objParent.parentNode);

	return false;
}

function fixIEQuotes()
{
	var objQuotes = document.getElementsByTagName('q');
	var strOpen, strClose;

	for (var iCounter=0; iCounter<objQuotes.length; iCounter++)
	{
		if (isNested(objQuotes[iCounter]))
		{
			strOpen = document.createTextNode('\u2018');
			strClose = document.createTextNode('\u2019');
		}
		else
		{
			strOpen = document.createTextNode('\u201c');
			strClose = document.createTextNode('\u201d');
		}
		objQuotes[iCounter].parentNode.insertBefore(strOpen, objQuotes[iCounter]);
		objQuotes[iCounter].appendChild(strClose);
	}

	objQuotes = null;
}

function addARIARole(strID, strRole, strLabel)
{
	var objElement = document.getElementById(strID);

	if (objElement)
	{
		objElement.setAttribute('role', strRole);
		if (strLabel.length > 0)
		{
			objElement.setAttribute('aria-label', strLabel);
		}
	}
}

function checkComment(objComment)
{
	var strName = objComment.contactname.value.replace(/^\s*|\s*$/g, '');
	var strEmail = objComment.email.value.replace(/^\s*|\s*$/g, '');
	var strURL = objComment.url.value.replace(/^\s*|\s*$/g, '');
	var strComment = objComment.comment.value.replace(/^\s*|\s*$/g, '');

	if (isString(strName) === false)
	{
		objComment.contactname.focus();
		return false;
	}
	if (isString(strComment) === false)
	{
		objComment.comment.focus();
		return false;
	}
	
	if (strEmail !== '')
	{
		if (isEmail(strEmail) === false)
		{
			objComment.email.focus();
			return false;
		}
	}

	if (strURL !== '')
	{
		if (isURL(strURL) === false)
		{
			objComment.url.focus();
			return false;
		}
	}

	return true;
}

function validateComment(objControl)
{
	var strValue = objControl.value.replace(/^\s*|\s*$/g, '');
	var strType = objControl.getAttribute('id');
	var strTipID = strType + 'tip';
	var objExisting = document.getElementById(strTipID);
	var objTip, strMessage, bValid;

	switch (strType)
	{
		case 'contactname':
		case 'comment':
		case 'nonsense':
			if (!isString(strValue))
			{
				objControl.setAttribute('aria-invalid', 'true');
			}
			else
			{
				objControl.setAttribute('aria-invalid', 'false');
			}
			break;
		case 'email':
		case 'url':
			if (strValue !== '')
			{
				if (strType === 'email')
				{
					bValid = isEmail(strValue);
					strMessage = 'Please enter a valid email address';
				}
				else
				{
					bValid = isURL(strValue);
					strMessage = 'Please enter a valid email URL';
				}
				if (!bValid)
				{
					objControl.setAttribute('aria-invalid', 'true');
					if (!objExisting)
					{
						objTip = document.createElement('div');
						objTip.appendChild(document.createTextNode(strMessage))
						objTip.setAttribute('id', strTipID);
						objTip.className = 'fielderror';
						objControl.parentNode.appendChild(objTip);
						objControl.setAttribute('aria-describedby', strTipID);
					}
				}
				else
				{
					objControl.setAttribute('aria-invalid', 'false');
					if (objExisting)
					{
						objExisting.parentNode.removeChild(objExisting);
						objControl.removeAttribute('aria-describedby');
					}
				}
			}
			else
			{
				objControl.setAttribute('aria-invalid', 'false');
				if (objExisting)
				{
					objExisting.parentNode.removeChild(objExisting);
					objControl.removeAttribute('aria-describedby');
				}
			}
			break;
	}
	return true;
}

function initialise()
{
	var objCommentform = document.getElementById('articlecommentform');
	var objName, objURL, objEmail, objComment, objSpam;

	addStyleEvents();

	if (objCommentform)
	{
		objName = document.getElementById('contactname');
		objURL = document.getElementById('url');
		objEmail = document.getElementById('email');
		objComment = document.getElementById('comment');
		objSpam = document.getElementById('nonsense');
		objCommentform.onsubmit = function(){return checkComment(this);};
		objName.onblur = function(){return validateComment(this);};
		objURL.onblur = function(){return validateComment(this);};
		objEmail.onblur = function(){return validateComment(this);};
		objComment.onblur = function(){return validateComment(this);};
		objSpam.onblur = function(){return validateComment(this);};
	}

	if (!window.opera && navigator.userAgent.indexOf('MSIE') != -1)
	{
		fixIEQuotes();
		addIETabOrder();
	}
}

window.onload = initialise;

// ö
