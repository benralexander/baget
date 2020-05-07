<script  id="headerSectionAboveControls"  type="x-tmpl-mustache">
{{#topSection}}
        <ul class="nav nav-tabs" role="tablist" style="font-size: 20px">
            {{#headers}}
            {{#.}}
            <li class="{{tabActive}}">
                <a href="#{{id}}" role="tab" data-toggle="tab">
                    {{tabDescription}}
%{--                    COVID-19 by country--}%
                </a>
            </li>
            {{/.}}
            {{/headers}}
%{--            <li><a href="#states" role="tab" data-toggle="tab">--}%
%{--                COVID-19 by US States--}%
%{--            </a>--}%
%{--            </li>--}%

        </ul>
{{/topSection}}
</script>


<script  id="tabContainingControlsAndPlot"  type="x-tmpl-mustache">
{{#.}}
<div class="tab-pane fade coreObject {{initialClasses}}" id="{{id}}" >
    <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
            <div class="dataChoosingSection">
                <div class="sectionDescription">
                    Choose data for analysis
                </div>
                <div class="row">
                    <div class="col-sm-4 clickOnSectionsWeWant">
                        <div class='dateChooserContainer'>
                            {{#dataChoosers}}
                                <div>
                                    <input type="checkbox" class="custom-control-input displayControl"
                                           {{checked}} onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this,'{{identifier}}')">
                                    <label class="custom-control-label displayControl">{{title}}</label>
                                </div>
                            {{/dataChoosers}}
                        </div>
                    </div>
                    <div class="col-sm-4 clickOnSectionsWeWant">
                        {{#dataFilters}}
                            <div class='text-center dateSliderContainer'>

                                <label >Date range:</label>
                                <input type="text" class="amount" style="margin-top: 10px" width="150"/>
                                <div class="dateSlider" style="margin-top: 10px"></div>


                            </div>
                        {{/dataFilters}}
                    </div>
                    <div class="col-sm-4 displayTheSectionsWeWant holdTheExpandableBlock" >
                        {{#specificDeactivators}}
                            <div class="everyGroupToDisplayHolder smaller" >
                                <div class="expander">
                                    <span class = "pull-left describeWhatWeAreExpanding">{{title}}</span>
                                    <span class = "pull-right expanderText" onclick="mpgSoftware.growthFactorLauncher.toggleDisplayOfSelectableElements(this)">Expand</span>
                                </div>
                                <div class="everyGroupToDisplay"></div>
                            </div>
                        {{/specificDeactivators}}

                    </div>

                </div>
            </div>
        </div>
        <div class="col-sm-2"></div>
    </div>
    <div class="row">

        <div class="col-sm-6 col-sm-offset-2" style="height: 190px">
            <div class="dataChoosingSection">
                <div class="sectionDescription">
                    Adjust analyses
                </div>
                <div class="row">
                    <div class="col-sm-7 clickOnSectionsWeWant">
                        <div class='dateChooserContainer' >
                            {{#analysisSelection}}
                                <div>
                                    <input type="checkbox" class="custom-control-input" {{checked}}
                                           onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this,'{{identifier}}')">
                                    <label class="custom-control-label">{{title}}</label>
                                </div>
                            {{/analysisSelection}}
                        </div>

                    </div>
                    <div class="col-sm-5 clickOnSectionsWeWant">
                        <div class='dateChooserContainer' >
                            {{#calculationAdjustment}}
                                <div>
                                    <input type="text" class="spinner {{className}}"/>
                                    <label class="custom-control-label">{{title}}</label>
                                </div>
                            {{/calculationAdjustment}}
                        </div>

                    </div>
                </div>
            </div>


        </div>
        <div class="col-sm-2" style="height: 190px">
            <div class="dataChoosingSection">
                <div class="sectionDescription">
                    Adjust display
                </div>
                {{#displayAdjustment}}
                <div class="text-center" >
                    <button type="button" class="btn btn-outline-primary logLinChg align-middle" onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this)"
                            style="">{{title}}</button>
                </div>
                {{/displayAdjustment}}
            </div>
        </div>
    </div>

    <div class="jumbotron" style = "padding: 0">
        {{#plotGoesHere}}
        <div id="{{id}}"></div>
        {{/plotGoesHere}}
    </div>

</div>

</div>
{{/.}}
</script>