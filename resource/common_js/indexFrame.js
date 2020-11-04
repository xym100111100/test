(function ($) {
    $.learuntab = {
        'requestFullScreen': function () {
            var de = document.documentElement;

            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        'exitFullscreen': function () {
            var de = document;

            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        'refreshTab': function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id');
            var target = $('.LRADMS_iframe[data-id="' + currentId + '"]');
            var url = target.attr('src');
            // $.loading(true);

            target.attr('src', url).load(function () {
                // $.loading(false);
            });
        },
        'activeTab': function () {
            var currentId = $(this).data('id');

            if (!$(this).hasClass('active')) {
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.learuntab.scrollToTab(this);
            }
        },
        'closeOtherTabs': function () {
            $('.page-tabs-content').children('[data-id]').find('.fa-remove').parents('a').not('.active').each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css('margin-left', '0');
        },
        'closeTab': function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();

            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');

                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));

                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            'marginLeft': marginLeftVal + currentWidth + 'px'
                        }, 'fast');
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');

                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            } else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        'addTab': function () {
            $('.navbar-custom-menu>ul>li.open').removeClass('open');
            $('a.menuItem').removeClass('active');
            $(this).addClass('active');
            var dataId = $(this).attr('data-id');

            if (dataId != '') {
                // top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href');
            var menuName = $.trim($(this).text());
            var flag = true;

            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.learuntab.scrollToTab(this);
                        $('.mainContent .LRADMS_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.LRADMS_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i></i></a>';

                $('.menuTab').removeClass('active');
                var str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';

                $('.mainContent').find('iframe.LRADMS_iframe').hide();
                $('.mainContent').append(str1);
                // $.loading(true);
                $('.mainContent iframe:visible').load(function () {
                    // $.loading(false);
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        'scrollTabRight': function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($('.content-tabs').children().not('.menuTabs'));
            var visibleWidth = $('.content-tabs').outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;

            if ($('.page-tabs-content').width() < visibleWidth) {
                return false;
            }
            var tabElement = $('.menuTab:first');
            var offsetVal = 0;

            while (offsetVal + $(tabElement).outerWidth(true) <= marginLeftVal) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while (offsetVal + $(tabElement).outerWidth(true) < visibleWidth && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $('.page-tabs-content').animate({
                    'marginLeft': 0 - scrollVal + 'px'
                }, 'fast');
            }

        },
        'scrollTabLeft': function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($('.content-tabs').children().not('.menuTabs'));
            var visibleWidth = $('.content-tabs').outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;

            if ($('.page-tabs-content').width() < visibleWidth) {
                return false;
            }
            var tabElement = $('.menuTab:first');
            var offsetVal = 0;

            while (offsetVal + $(tabElement).outerWidth(true) <= marginLeftVal) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if ($.learuntab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while (offsetVal + $(tabElement).outerWidth(true) < visibleWidth && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
            }

            $('.page-tabs-content').animate({
                'marginLeft': 0 - scrollVal + 'px'
            }, 'fast');
        },
        'scrollToTab': function (element) {
            var marginLeftVal = $.learuntab.calSumWidth($(element).prevAll()); var marginRightVal = $.learuntab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.learuntab.calSumWidth($('.content-tabs').children().not('.menuTabs'));
            var visibleWidth = $('.content-tabs').outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;

            if ($('.page-tabs-content').outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true)) {
                if (visibleWidth - $(element).next().outerWidth(true) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;

                    while (scrollVal - $(tabElement).outerWidth() > $('.page-tabs-content').outerWidth() - visibleWidth) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true)) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                'marginLeft': 0 - scrollVal + 'px'
            }, 'fast');
        },
        'calSumWidth': function (element) {
            var width = 0;

            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        'init': function () {
            $('.menuItem').on('click', $.learuntab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.learuntab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.learuntab.activeTab);
            $('.tabLeft').on('click', $.learuntab.scrollTabLeft);
            $('.tabRight').on('click', $.learuntab.scrollTabRight);
            $('.tabReload').on('click', $.learuntab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger('click');
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children('[data-id]').find('.fa-remove').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children('[data-id]:first').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass('active');
                });
                $('.page-tabs-content').css('margin-left', '0');
            });
            $('.tabCloseOther').on('click', $.learuntab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.learuntab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen');
                    $.learuntab.exitFullscreen();
                }
            });
        }
    };
    $.learunindex = {
        'load': function () {
            $('body').removeClass('hold-transition');
            $('#content-wrapper').find('.mainContent').height($(window).height() - 100);
            $(window).resize(function (e) {
                $('#content-wrapper').find('.mainContent').height($(window).height() - 100);
            });
            $('.sidebar-toggle').click(function () {
                if (!$('body').hasClass('sidebar-collapse')) {
                    $('body').addClass('sidebar-collapse');
                } else {
                    $('body').removeClass('sidebar-collapse');
                }
            });
            $(window).load(function () {
                window.setTimeout(function () {
                    $('#ajax-loader').fadeOut();
                }, 300);
            });
        },
        'jsonWhere': function (data, action) {
            if (action == null) {
                return;
            }
            var reval = new Array();

            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            });
            return reval;
        },
        'loadMenu': function () {
            var data = [{
                'F_ModuleId': '1',
                'F_ParentId': '0',
                'F_FullName': '仓储设施',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            },
            {
                'F_ModuleId': '2',
                'F_ParentId': '0',
                'F_FullName': '统计报表',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '3',
                'F_ParentId': '0',
                'F_FullName': '放心粮油生产企业',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '4',
                'F_ParentId': '0',
                'F_FullName': '涉粮企业信息管理',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '5',
                'F_ParentId': '0',
                'F_FullName': '储备粮监管',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '6',
                'F_ParentId': '0',
                'F_FullName': '基础管理',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '7',
                'F_ParentId': '0',
                'F_FullName': '党务活动管理',
                'F_Icon': 'menu-icon menu2',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '8',
                'F_ParentId': '0',
                'F_FullName': '可视化配置',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '9',
                'F_ParentId': '0',
                'F_FullName': '粮油市场监测',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '10',
                'F_ParentId': '0',
                'F_FullName': '执行监管',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '11',
                'F_ParentId': '0',
                'F_FullName': '转储监管',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '12',
                'F_ParentId': '0',
                'F_FullName': '监督检查',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '13',
                'F_ParentId': '0',
                'F_FullName': '粮食收购资金管理',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '14',
                'F_ParentId': '0',
                'F_FullName': '预算及报销管理',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '15',
                'F_ParentId': '0',
                'F_FullName': '人事管理',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '16',
                'F_ParentId': '0',
                'F_FullName': '工作流管理',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '17',
                'F_ParentId': '0',
                'F_FullName': '数据源管理',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '18',
                'F_ParentId': '0',
                'F_FullName': '库存检查',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '19',
                'F_ParentId': '0',
                'F_FullName': '3D建模',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '20',
                'F_ParentId': '0',
                'F_FullName': '粮食报表',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '21',
                'F_ParentId': '0',
                'F_FullName': '储备粮监管',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '22',
                'F_ParentId': '0',
                'F_FullName': '项目建设',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '23',
                'F_ParentId': '0',
                'F_FullName': '仓储物流',
                'F_Icon': 'menu-icon menu1',
                'F_UrlAddress': null,
                'F_IsMenu': 0
            }, {
                'F_ModuleId': '1-1',
                'F_ParentId': '1',
                'F_FullName': '汇总备案管理',
                'F_UrlAddress': '../html/storage/record.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-2',
                'F_ParentId': '1',
                'F_FullName': '汇总备案查询',
                'F_UrlAddress': '../html/storage/recordCount.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-3',
                'F_ParentId': '1',
                'F_FullName': '仓储设施管理',
                'F_UrlAddress': '../html/storage/storageFacility.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-4',
                'F_ParentId': '1',
                'F_FullName': '基础设施管理',
                'F_UrlAddress': '../html/storage/baseFacility.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-5',
                'F_ParentId': '1',
                'F_FullName': '星级粮库创建',
                'F_UrlAddress': '../html/star/dataUpload.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-6',
                'F_ParentId': '1',
                'F_FullName': '星级粮库管理',
                'F_UrlAddress': '../html/star/grainManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '1-7',
                'F_ParentId': '1',
                'F_FullName': 'ztree转table',
                'F_UrlAddress': '../html/storage/ztreeToTable.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-1',
                'F_ParentId': '2',
                'F_FullName': '仓储设施',
                'F_UrlAddress': '../html/reportForm/storageFacilities.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-2',
                'F_ParentId': '2',
                'F_FullName': '涉粮企业',
                'F_UrlAddress': '../html/reportForm/grainrelatedEnterprise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-3',
                'F_ParentId': '2',
                'F_FullName': '仓储单位',
                'F_UrlAddress': '../html/reportForm/storageCompany.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-4',
                'F_ParentId': '2',
                'F_FullName': '油罐、廒间信息',
                'F_UrlAddress': '../html/reportForm/oiltankRoom.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-5',
                'F_ParentId': '2',
                'F_FullName': '检化验条件',
                'F_UrlAddress': '../html/reportForm/inspectionConditions.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '2-6',
                'F_ParentId': '2',
                'F_FullName': '涉粮人员信息',
                'F_UrlAddress': '../html/reportForm/personnelInformation.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '3-1',
                'F_ParentId': '3',
                'F_FullName': '企业资格评审',
                'F_UrlAddress': '../html/reassurance/dataUpload.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '3-2',
                'F_ParentId': '3',
                'F_FullName': '放心粮油企业管理',
                'F_UrlAddress': '../html/reassurance/grainManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '4-1',
                'F_ParentId': '4',
                'F_FullName': '涉粮企业数据查询',
                'F_UrlAddress': '../html/grainRelated/mapData.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-1',
                'F_ParentId': '5',
                'F_FullName': '库存监管',
                'F_UrlAddress': '../html/grainSupervise/stockSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-2',
                'F_ParentId': '5',
                'F_FullName': '仓容管理',
                'F_UrlAddress': '../html/grainSupervise/storageSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-3',
                'F_ParentId': '5',
                'F_FullName': '出入库管理',
                'F_UrlAddress': '../html/grainSupervise/ioLibSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-4',
                'F_ParentId': '5',
                'F_FullName': '移库管理',
                'F_UrlAddress': '../html/grainSupervise/transLibSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-5',
                'F_ParentId': '5',
                'F_FullName': '质量管理',
                'F_UrlAddress': '../html/grainSupervise/qualitySupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-6',
                'F_ParentId': '5',
                'F_FullName': '粮情监管',
                'F_UrlAddress': '../html/grainSupervise/conditionSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-7',
                'F_ParentId': '5',
                'F_FullName': '产销客户',
                'F_UrlAddress': '../html/grainSupervise/customerSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '5-8',
                'F_ParentId': '5',
                'F_FullName': '库存数量监管',
                'F_UrlAddress': '../html/grainSupervise/stockNumSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '6-1',
                'F_ParentId': '6',
                'F_FullName': '党组织管理',
                'F_UrlAddress': '../html/BasicManagement/partyorganization.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '6-2',
                'F_ParentId': '6',
                'F_FullName': '党员数据库',
                'F_UrlAddress': '../html/BasicManagement/DataBase.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '6-3',
                'F_ParentId': '6',
                'F_FullName': '党小组管理',
                'F_UrlAddress': '../html/BasicManagement/PartyGroup.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '6-4',
                'F_ParentId': '6',
                'F_FullName': '党领导班子',
                'F_UrlAddress': '../html/BasicManagement/PartyLeadership.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-1',
                'F_ParentId': '7',
                'F_FullName': '支部党员大会',
                'F_UrlAddress': '../html/PartyAffairsActivities/PartyCongress.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-2',
                'F_ParentId': '7',
                'F_FullName': '党支部委员会',
                'F_UrlAddress': '../html/PartyAffairsActivities/Committee.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-3',
                'F_ParentId': '7',
                'F_FullName': '党小组会',
                'F_UrlAddress': '../html/PartyAffairsActivities/PartyGroup.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-4',
                'F_ParentId': '7',
                'F_FullName': '党课',
                'F_UrlAddress': '../html/PartyAffairsActivities/PartyLecture.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-5',
                'F_ParentId': '7',
                'F_FullName': '组织生活会',
                'F_UrlAddress': '../html/PartyAffairsActivities/OrganizationLife.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-6',
                'F_ParentId': '7',
                'F_FullName': '民主评议党员',
                'F_UrlAddress': '../html/PartyAffairsActivities/DemocraticReview.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-7',
                'F_ParentId': '7',
                'F_FullName': '党员领导干部双重领导生活',
                'F_UrlAddress': '../html/PartyAffairsActivities/DoubleLife.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-8',
                'F_ParentId': '7',
                'F_FullName': '党组织按期换届制度',
                'F_UrlAddress': '../html/PartyAffairsActivities/ExchangeSystem.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-9',
                'F_ParentId': '7',
                'F_FullName': '支部主题党日活动',
                'F_UrlAddress': '../html/PartyAffairsActivities/PartyActivities.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '7-10',
                'F_ParentId': '7',
                'F_FullName': '信息录入',
                'F_UrlAddress': '../html/PartyAffairsActivities/InformationEntry.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '8-1',
                'F_ParentId': '8',
                'F_FullName': '场景管理',
                'F_UrlAddress': '../html/visualManage/sceneManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '8-2',
                'F_ParentId': '8',
                'F_FullName': '母版管理',
                'F_UrlAddress': '../html/visualManage/mVersionManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '8-3',
                'F_ParentId': '8',
                'F_FullName': '仪表盘管理',
                'F_UrlAddress': '../html/visualManage/dashboardManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '9-1',
                'F_ParentId': '9',
                'F_FullName': '粮油价格管理',
                'F_UrlAddress': '../html/marketMonitor/priceManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '9-2',
                'F_ParentId': '9',
                'F_FullName': '粮油价格检测',
                'F_UrlAddress': '../html/marketMonitor/priceTest.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '9-3',
                'F_ParentId': '9',
                'F_FullName': '粮油价格预警',
                'F_UrlAddress': '../html/marketMonitor/priceWarning.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '9-4',
                'F_ParentId': '9',
                'F_FullName': '粮油价格预警阈值设置',
                'F_UrlAddress': '../html/marketMonitor/priceWarningSet.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '10-1',
                'F_ParentId': '10',
                'F_FullName': '新粮收购填报',
                'F_UrlAddress': '../html/executeSupervise/buyFillIn.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '10-2',
                'F_ParentId': '10',
                'F_FullName': '新粮收购监管',
                'F_UrlAddress': '../html/executeSupervise/buySupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '10-3',
                'F_ParentId': '10',
                'F_FullName': '直补订单监管',
                'F_UrlAddress': '../html/executeSupervise/orderSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '10-4',
                'F_ParentId': '10',
                'F_FullName': '转储执行监管',
                'F_UrlAddress': '../html/executeSupervise/dumpSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '10-5',
                'F_ParentId': '10',
                'F_FullName': '销售监管',
                'F_UrlAddress': '../html/executeSupervise/saleSupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-1',
                'F_ParentId': '11',
                'F_FullName': '验收工作流程',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceWorkflow.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-2',
                'F_ParentId': '11',
                'F_FullName': '验收通知管理',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceNotice.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-3',
                'F_ParentId': '11',
                'F_FullName': '验收申请监管',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceApply.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-4',
                'F_ParentId': '11',
                'F_FullName': '验收实施监管',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceImplement.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-5',
                'F_ParentId': '11',
                'F_FullName': '验收报告管理',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceReport.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-6',
                'F_ParentId': '11',
                'F_FullName': '转储核定管理',
                'F_UrlAddress': '../html/dumpSupervise/dumpedManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-7',
                'F_ParentId': '11',
                'F_FullName': '验收结果管理',
                'F_UrlAddress': '../html/dumpSupervise/acceptanceResult.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '11-8',
                'F_ParentId': '11',
                'F_FullName': '核定通知管理',
                'F_UrlAddress': '../html/dumpSupervise/dumpedNotice.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '12-1',
                'F_ParentId': '12',
                'F_FullName': '随机抽查平台',
                'F_UrlAddress': '../html/superviseAndInspect/randomCheck.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '12-2',
                'F_ParentId': '12',
                'F_FullName': '检查档案管理',
                'F_UrlAddress': '../html/superviseAndInspect/archivesCheck.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-2',
                'F_ParentId': '13',
                'F_FullName': '收购资金报表查询',
                'F_UrlAddress': '../html/fundManage/fundList.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-3',
                'F_ParentId': '13',
                'F_FullName': '计划管理',
                'F_UrlAddress': '../html/fundManage/planManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-4',
                'F_ParentId': '13',
                'F_FullName': '项目建设管理',
                'F_UrlAddress': '../html/fundManage/pmc.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-5',
                'F_ParentId': '13',
                'F_FullName': '资金拨付及跟踪',
                'F_UrlAddress': '../html/fundManage/fundFollowing.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-6',
                'F_ParentId': '13',
                'F_FullName': '代储资格管理',
                'F_UrlAddress': '../html/fundManage/reserveQualityManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-7',
                'F_ParentId': '13',
                'F_FullName': '质检机构管理',
                'F_UrlAddress': '../html/fundManage/qualityTestOrg.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-8',
                'F_ParentId': '13',
                'F_FullName': '质检档案管理',
                'F_UrlAddress': '../html/fundManage/qualityTestArchive.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-9',
                'F_ParentId': '13',
                'F_FullName': '质检检测管理',
                'F_UrlAddress': '../html/fundManage/qualityTestManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-10',
                'F_ParentId': '13',
                'F_FullName': '库存识别代码',
                'F_UrlAddress': '../html/fundManage/codeReg.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-11',
                'F_ParentId': '13',
                'F_FullName': '检测业务流程管理',
                'F_UrlAddress': '../html/fundManage/testProcess.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-12',
                'F_ParentId': '13',
                'F_FullName': '粮食质量追溯',
                'F_UrlAddress': '../html/fundManage/grainQualityReview.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-13',
                'F_ParentId': '13',
                'F_FullName': '粮食业务追溯',
                'F_UrlAddress': '../html/fundManage/grainBusinessReview.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-14',
                'F_ParentId': '13',
                'F_FullName': '粮食质量监管',
                'F_UrlAddress': '../html/fundManage/grainQualitySupervise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '13-15',
                'F_ParentId': '13',
                'F_FullName': '项目资金管理',
                'F_UrlAddress': '../html/fundManage/projectFundManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-1',
                'F_ParentId': '14',
                'F_FullName': '项目预算编制情况',
                'F_UrlAddress': '../html/budget/budgetarySitu.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-2',
                'F_ParentId': '14',
                'F_FullName': '项目预算编制审核',
                'F_UrlAddress': '../html/budget/budgetaryAudit.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-3',
                'F_ParentId': '14',
                'F_FullName': '预算调整申请',
                'F_UrlAddress': '../html/budget/budgetaryAdjust.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-4',
                'F_ParentId': '14',
                'F_FullName': '预算通知流程',
                'F_UrlAddress': '../html/budget/budgetaryFlow.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-5',
                'F_ParentId': '14',
                'F_FullName': '报销申请',
                'F_UrlAddress': '../html/budget/reimbursementApply.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-6',
                'F_ParentId': '14',
                'F_FullName': '转账付款发票统计',
                'F_UrlAddress': '../html/budget/reimbursementSum.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '14-7',
                'F_ParentId': '14',
                'F_FullName': '报销流程查看',
                'F_UrlAddress': '../html/budget/reimbursementFlow.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '15-1',
                'F_ParentId': '15',
                'F_FullName': '人员考核',
                'F_UrlAddress': '../html/personnel/personnelAssessment.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '15-2',
                'F_ParentId': '15',
                'F_FullName': '民主测评',
                'F_UrlAddress': '../html/personnel/democraticAppraisal.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '15-3',
                'F_ParentId': '15',
                'F_FullName': '民主测评结果',
                'F_UrlAddress': '../html/personnel/democraticAppraisalR.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '15-4',
                'F_ParentId': '15',
                'F_FullName': '节假日安排',
                'F_UrlAddress': '../html/personnel/holidayArrange.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-1',
                'F_ParentId': '16',
                'F_FullName': '待办任务',
                'F_UrlAddress': '../html/workflow/pendingTask.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-2',
                'F_ParentId': '16',
                'F_FullName': '已办任务',
                'F_UrlAddress': '../html/workflow/task.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-3',
                'F_ParentId': '16',
                'F_FullName': '运行中流程',
                'F_UrlAddress': '../html/workflow/runningFlow.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-4',
                'F_ParentId': '16',
                'F_FullName': '历史流程',
                'F_UrlAddress': '../html/workflow/historyFlow.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-5',
                'F_ParentId': '16',
                'F_FullName': '表单列表',
                'F_UrlAddress': '../html/workflow/flowForm.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-6',
                'F_ParentId': '16',
                'F_FullName': '候选管理',
                'F_UrlAddress': '../html/workflow/candidateManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '16-7',
                'F_ParentId': '16',
                'F_FullName': '流程监控概述',
                'F_UrlAddress': '../html/workflow/flowSummary.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '17-1',
                'F_ParentId': '17',
                'F_FullName': '数据源列表',
                'F_UrlAddress': '../html/dataBase/databaseList.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '17-2',
                'F_ParentId': '17',
                'F_FullName': '仪表盘管理',
                'F_UrlAddress': '../html/dataBase/chartManage.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '17-3',
                'F_ParentId': '17',
                'F_FullName': '数据模型列表',
                'F_UrlAddress': '../html/dataBase/dataModel.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '18-1',
                'F_ParentId': '18',
                'F_FullName': '粮食库存检查汇总表',
                'F_UrlAddress': '../html/stockInspection/stockInspection.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '18-2',
                'F_ParentId': '18',
                'F_FullName': '追溯图',
                'F_UrlAddress': '../html/stockInspection/review.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '18-3',
                'F_ParentId': '18',
                'F_FullName': '粮油质检追溯',
                'F_UrlAddress': '../html/stockInspection/review2.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '18-4',
                'F_ParentId': '18',
                'F_FullName': '国家数据共享',
                'F_UrlAddress': '../html/stockInspection/shareDataList.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-1',
                'F_ParentId': '19',
                'F_FullName': '集成页',
                'F_UrlAddress': '../html/3D/3dIntegrate.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-2',
                'F_ParentId': '19',
                'F_FullName': '视频监控',
                'F_UrlAddress': '../html/3D/videoMonitor.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-3',
                'F_ParentId': '19',
                'F_FullName': '仓储设施统计',
                'F_UrlAddress': '../html/3D/warehouseCount.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-4',
                'F_ParentId': '19',
                'F_FullName': '储备粮库存集成',
                'F_UrlAddress': '../html/3D/grainDepot.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-5',
                'F_ParentId': '19',
                'F_FullName': '自治区/市级/县级储备粮库存集成',
                'F_UrlAddress': '../html/3D/grainDepot2.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-6',
                'F_ParentId': '19',
                'F_FullName': '自治区/市级/县级粮油质量集成',
                'F_UrlAddress': '../html/3D/grainQuality.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-7',
                'F_ParentId': '19',
                'F_FullName': '地方储备粮油质量集成',
                'F_UrlAddress': '../html/3D/grainQuality2.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-8',
                'F_ParentId': '19',
                'F_FullName': '仓储设施统计（深色）',
                'F_UrlAddress': '../html/3D/warehouseCountDark.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-9',
                'F_ParentId': '19',
                'F_FullName': '安全会议台账集成（深色）',
                'F_UrlAddress': '../html/3D/safeMeetingsDark.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-10',
                'F_ParentId': '19',
                'F_FullName': '安全培训教育集成（深色）',
                'F_UrlAddress': '../html/3D/safeTrainDark.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-11',
                'F_ParentId': '19',
                'F_FullName': '粮食监管（深色）',
                'F_UrlAddress': '../html/3D/grainSupervisionDark.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-12',
                'F_ParentId': '19',
                'F_FullName': '智能决策分析系统',
                'F_UrlAddress': '../html/3D/analysisSystem.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-13',
                'F_ParentId': '19',
                'F_FullName': '粮情监控',
                'F_UrlAddress': '../html/3D/grainMonitoring.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-14',
                'F_ParentId': '19',
                'F_FullName': '出入库分析',
                'F_UrlAddress': '../html/3D/warehouseInOutAnalysis.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-15',
                'F_ParentId': '19',
                'F_FullName': '库存分析',
                'F_UrlAddress': '../html/3D/inventoryAnalyst.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '19-16',
                'F_ParentId': '19',
                'F_FullName': '涉粮企业分析',
                'F_UrlAddress': '../html/3D/grainEnterprisesAnalysis.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-1',
                'F_ParentId': '20',
                'F_FullName': '仓储设施',
                'F_UrlAddress': '../html/reportForm/storageFacilities.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-2',
                'F_ParentId': '20',
                'F_FullName': '涉粮企业',
                'F_UrlAddress': '../html/reportForm/grainrelatedEnterprise.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-3',
                'F_ParentId': '20',
                'F_FullName': '仓储单位',
                'F_UrlAddress': '../html/reportForm/storageCompany.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-4',
                'F_ParentId': '20',
                'F_FullName': '油罐、廒间信息',
                'F_UrlAddress': '../html/reportForm/oiltankRoom.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-5',
                'F_ParentId': '20',
                'F_FullName': '检化验条件',
                'F_UrlAddress': '../html/reportForm/inspectionConditions.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '20-6',
                'F_ParentId': '20',
                'F_FullName': '涉粮人员信息',
                'F_UrlAddress': '../html/reportForm/personnelInformation.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '21-1',
                'F_ParentId': '21',
                'F_FullName': '储备粮监管',
                'F_UrlAddress': '../html/grainReverseSupervise/visualSupervise1.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '22-1',
                'F_ParentId': '22',
                'F_FullName': '维修进度归集',
                'F_UrlAddress': '../html/projectConstruction/collectionMaintenance.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '22-2',
                'F_ParentId': '22',
                'F_FullName': '项目资金归集',
                'F_UrlAddress': '../html/projectConstruction/cashSweep.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '22-3',
                'F_ParentId': '22',
                'F_FullName': '维修进展报送',
                'F_UrlAddress': '../html/projectConstruction/progressMaintenance.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '22-4',
                'F_ParentId': '22',
                'F_FullName': '项目资金报送',
                'F_UrlAddress': '../html/projectConstruction/capitalSubmission.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '22-5',
                'F_ParentId': '22',
                'F_FullName': '建设情况分析',
                'F_UrlAddress': '../html/projectConstruction/situationAnalysis.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '23-1',
                'F_ParentId': '23',
                'F_FullName': '单位信息-查看',
                'F_UrlAddress': '../html/declare/information.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '23-2',
                'F_ParentId': '23',
                'F_FullName': '单位信息-提交',
                'F_UrlAddress': '../html/declare/informationSubmit.html',
                'F_IsMenu': 1
            }, {
                'F_ModuleId': '23-3',
                'F_ParentId': '23',
                'F_FullName': '备案变更申请',
                'F_UrlAddress': '../html/declare/recordChangeApply.html',
                'F_IsMenu': 1
            }];
            var _html = '';

            $.each(data, function (i) {
                var row = data[i];

                if (row.F_ParentId == '0') {
                    if (i == 0) {
                        _html += '<li class="treeview active">';
                    } else {
                        _html += '<li class="treeview">';
                    }
                    _html += '<a href="#">';
                    _html += '<i class="' + row.F_Icon + '"></i><span>' + row.F_FullName + '</span><i class="fa fa-angle-left pull-right"></i>';
                    _html += '</a>';
                    var childNodes = $.learunindex.jsonWhere(data, function (v) {
                        return v.F_ParentId == row.F_ModuleId;
                    });

                    if (childNodes.length > 0) {
                        _html += '<ul class="treeview-menu">';
                        $.each(childNodes, function (i) {
                            var subrow = childNodes[i];
                            var subchildNodes = $.learunindex.jsonWhere(data, function (v) {
                                return v.F_ParentId == subrow.F_ModuleId;
                            });

                            _html += '<li>';
                            if (subchildNodes.length > 0) {
                                _html += String('<a href="#"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName);
                                _html += '<i class="fa fa-angle-left pull-right"></i></a>';
                                _html += '<ul class="treeview-menu">';
                                $.each(subchildNodes, function (i) {
                                    var subchildNodesrow = subchildNodes[i];

                                    _html += '<li><a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subchildNodesrow.F_Icon + '"></i>' + subchildNodesrow.F_FullName + '</a></li>';
                                });
                                _html += '</ul>';

                            } else {
                                _html += '<a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName + '</a>';
                            }
                            _html += '</li>';
                        });
                        _html += '</ul>';
                    }
                    _html += '</li>';
                }
            });
            $('#sidebar-menu').append(_html);
            $('#sidebar-menu li a').click(function () {
                var d = $(this); var e = d.next();

                if (e.is('.treeview-menu') && e.is(':visible')) {
                    e.slideUp(500, function () {
                        e.removeClass('menu-open');
                    }),
                        e.parent('li').removeClass('active');
                } else if (e.is('.treeview-menu') && !e.is(':visible')) {
                    var f = d.parents('ul').first();
                    var g = f.find('ul:visible').slideUp(500);

                    g.removeClass('menu-open');
                    var h = d.parent('li');

                    e.slideDown(500, function () {
                        e.addClass('menu-open'),
                            f.find('li.active').removeClass('active'),
                            h.addClass('active');

                        var _height1 = $(window).height() - $('#sidebar-menu >li.active').position().top - 41;
                        var _height2 = $('#sidebar-menu li > ul.menu-open').height() + 10;

                        if (_height2 > _height1) {
                            $('#sidebar-menu >li > ul.menu-open').css({
                                'overflow': 'auto',
                                'height': _height1
                            });
                        }
                    });
                }
                e.is('.treeview-menu');
            });
        }
    };
    $(function () {
        $.learunindex.load();
        $.learunindex.loadMenu();
        $.learuntab.init();
        // layer样式加载
        // 全局使用。即所有弹出层都默认采用，但是单个配置skin的优先级更高
        layer.config({
            'extend': 'myskin/style.css', // 加载您的扩展样式
            'skin': 'layer-ext-myskin'
        });
    });
})(jQuery);