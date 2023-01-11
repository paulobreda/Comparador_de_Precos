window.googletag = window.googletag || {cmd: []};
const googletag = window.googletag;

window.addEventListener("orientationchange", function() {
    googletag.cmd.push(() => {
        googletag.pubads().refresh();
    });
});

/**
 * @function
 * @description - Get default and size mapping
 * @param {Element} $gptContent - Advertising element
 */
const getSizes = $gptContent => {
    let mapping;
    let defaultSize = [];
    let dataSize = $gptContent.data("size");

    if (dataSize) {
        defaultSize = dataSize[0];
        mapping = dataSize[1];
    }

    return { mapping: mapping, default: defaultSize };
};

/**
 * @function
 * @description - Update Google ads
 * @param {Element} $gptContents - Advertising elements
 */
const updateAds = $gptContents => {
    $gptContents.each((index, element) => {
        let $this = $(element);
        let unitPath = $this.data("unitpath") || null;
        let adId = $this.attr("id") || null;
        let size = getSizes($this);
        let isRefreshable = $this.data("refresh") ? $this.data("refresh") : false;

        if (unitPath && adId && size) {
            googletag.cmd.push(() => {
                googletag.defineSlot(unitPath, size.default, adId).defineSizeMapping(size.mapping).setTargeting("refresh", isRefreshable).addService(googletag.pubads());
                googletag.enableServices();
                googletag.pubads().addEventListener("slotRenderEnded", function(event) {
                    $(".gpt-contents").each(function(index, item) {
						const $iframeGoolgeAdds = $(item).find("iframe");
						if ($iframeGoolgeAdds.length > 0) {
							const $imgs = $iframeGoolgeAdds.contents().find("img");
                            if ($imgs.length > 0) {
                                $imgs.each(function(indexImg, itemImg) {
                                    let $currentImg = $(itemImg);
                                    const currentWidth = $currentImg.attr("width");
                                    if (currentWidth > 0) {
                                        $iframeGoolgeAdds.attr("width", "100%");
                                        $iframeGoolgeAdds.css("max-width", currentWidth + "px");
                                    }
                                    $currentImg.removeAttr("width");
                                });
                            }
						}
					});
                });
            });

            googletag.cmd.push(() => {
                googletag.display(adId);
            });

        }
    });
};

/**
 * @function
 * @description - Refresh ads
 */
const refreshAds = () => {
    setTimeout(() => {
        googletag.cmd.push(() => {
            googletag.pubads().refresh();
        });
    }, 100);
};

const Publico = function () {
    this.init = () => {
        if (window.location.search.indexOf("disableAds") != -1) {
            return;
        }

        loadAds();
        initAdEvents();
    };

    /**
     * @function
     * @description - Load GPT script
     */
    let loadGPTScript = () => {
        let gptElement = document.createElement("script");
        let firstScriptTag = document.getElementsByTagName("script")[0];

        gptElement.type = "text/javascript";
        gptElement.async = true;
        gptElement.src = "https://www.googletagservices.com/tag/js/gpt.js";

        firstScriptTag.parentNode.insertBefore(gptElement, firstScriptTag);
    };

    /**
     * @function
     * @description - Load Google ads at page load
     */
    let loadAds = () => {
        loadGPTScript();

        let $gptContents = $(".gpt-contents");

        if ($gptContents.length == 0) {
            return false;
        }

        updateAds($gptContents);
    };

    /**
     * @function
     * @description - Initialize events
     */
    let initAdEvents = () => {
        $("body").on("googleadd:refresh", refreshAds);

        googletag.cmd.push(() => {
            googletag.pubads().addEventListener("slotRenderEnded",  (event) => {
                const slot = event.slot;

                document.dispatchEvent(new CustomEvent("dataLayer.displayGoogleAd", {
                    detail: {
                        "slotID" : slot.getSlotElementId()
                    }
                }));

            });
        });

    };
};

export { Publico };
