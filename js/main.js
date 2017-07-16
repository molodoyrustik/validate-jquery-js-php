$(document).ready(function(){
    if($('.popup').length) {
        Popups.init();
    }

    $('#form').on('submit', function(e){
        e.preventDefault();

        var $this = $(this);

        if( validateThis($this) ) {
            postFormData($this, function(data) {
                if( data.status == 5) {
                    Popups.open('#success');
                    // появление попапа success
                } else {
                    console.log('error post');
                    Popups.open('#error');
                }
            });
        }

    });
});

var Popups = (function() {
    var popups = $('.popup');

    function _close() {
        popups.hide();
    }

    return {
        init: function() {
            $('.popup__close, .popup__overlay').on('click', function(e) {
                e.preventDefault();
                _close();
            })
        },

        open: function(id) {
            var reqPopup = popups.filter(id);

            _close();
            reqPopup.fadeIn(500);
        }
    }
})();

function postFormData(form, successCallback) {
    var host = form.attr('action');
    var reqFields = form.find('[name]');
    var dataObject = {};

    reqFields.each(function() {
        var $this = $(this);
        var value = $this.val();
        var name = $this.attr('name');

        dataObject[name] = value;
    });

    $.post(host, dataObject, successCallback);
}

function validateThis(form) {

    var textType = form.find("[data-validation='text']");
    var mailType = form.find("[data-validation='mail']");
    var isValid = false;

    textType.each(function(){
        var $this = $(this);
        var notEmptyField = !!$this.val();

        if(notEmptyField) {
            isValid = true;
        } else {
            $this.tooltip({content: 'Заполните поле', position: 'left'});
            isValid = false;
        }
    });

    mailType.each(function(){
        var $this = $(this);
        var regExp = /@{1}/;
        var isMail = regExp.test($this.val());

        if(isMail) {
            isValid = true;
        } else {
            $this.tooltip({
                content: 'Неверный e-mail',
                position: 'bottom'
            });
            isValid = false;
        }
    });

    return isValid;
}

$.fn.tooltip = function(options) {

    options = {
        position : options.position || 'right',
        content  : options.content || 'I am tooltip'
    };

    var markup = `<div class="tooltip tooltip_${options.position}">
				<div class="tooltip__inner">
					${options.content}
				</div>
			</div>`;

    var $this = this;
    var body = $('body');

    $this
        .addClass('tooltipstered')
        .attr('data-tooltip-position', options.position);

    body.append(markup);

    _positionIt($this, body.find('.tooltip').last(), options.position);

    $(document).on('click', function(e) {
        $('.tooltip').remove();
    });

    $(window).on('resize', function(e) {
        var tooltips = $('.tooltip');
        var tooltipsArray = [];

        tooltips.each(function(){
            tooltipsArray.push($(this));
        });

        $('.tooltipstered').each(function(i){
            var position = $(this).data('tooltip-position');
            _positionIt($(this), tooltipsArray[i], position);
        });


    });

    function _positionIt(elem, tooltip, position) {
        //измеряем элемент

        var
            elemWidth   = elem.outerWidth(true),
            elemHeight  = elem.outerHeight(true),
            topEdge     = elem.offset().top,
            bottomEdge  = topEdge + elemHeight,
            leftEdge    = elem.offset().left,
            rightEdge   = leftEdge + elemWidth;
        // измеряем тултип

        var
            tooltipWidth    = tooltip.outerWidth(true),
            tooltipHeight   = tooltip.outerHeight(true),
            leftCentered    = (elemWidth / 2) - (tooltipWidth / 2),
            topCentered     = (elemHeight / 2) - (tooltipHeight / 2);

        var positions = {};

        switch (position) {
            case 'right' :
                positions = {
                    left : rightEdge,
                    top : topEdge + topCentered
                };
                break;
            case 'top' :
                positions = {
                    left: leftEdge + leftCentered,
                    top : topEdge - tooltipHeight
                };
                break;
            case 'bottom' :
                positions = {
                    left : leftEdge + leftCentered,
                    top : bottomEdge
                };
                break;
            case 'left' :
                positions = {
                    left : leftEdge - tooltipWidth,
                    top : topEdge + topCentered
                };
                break;
        }

        tooltip.offset(positions).css('opacity', '1');
    }
};
