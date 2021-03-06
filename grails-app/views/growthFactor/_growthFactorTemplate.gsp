<script  id="headerSectionAboveControls"  type="x-tmpl-mustache">
{{#topSection}}
        <ul class="nav nav-tabs" role="tablist" style="font-size: 20px">
            {{#headers}}
                {{#.}}
                    <li class="{{tabActive}}">
                        <a href="#{{id}}" role="tab" data-toggle="tab">
                            {{tabDescription}}
                        </a>
                    </li>
                {{/.}}
            {{/headers}}
        </ul>
{{/topSection}}
</script>


<script  id="tabContainingControlsAndPlot"  type="x-tmpl-mustache">
{{#.}}
<div class="tab-pane fade coreObject {{initialClasses}}" id="{{id}}" >
    <div class="row">
        <div class="col-lg-8 col-lg-offset-2 col-sm-12">
            <div class="row">
                <div class="col-sm-4">
                    <div class="dataChoosingSection">
                        <div class="sectionDescription" style="margin-bottom: 5px">
                            Choose data for analysis
                        </div>
                        <div class="row">

                        <div class="col-sm-12 clickOnSectionsWeWant">
                            <div class="dropDownDataSelector">
                                  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"
                                  aria-haspopup="true" aria-expanded="true" name="{{dropDownDataSelectorfield}}">
                                    <span class="dropDownDataSelectorLabel">{{dropDownDataSelectorLabel}}
                                    <span class="caret"></span>
                                  </button>
                                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                  {{#availableDataTypeChoices}}
                                    <li><a onclick="mpgSoftware.growthFactorLauncher.changeDatatypeDisplayed(this)" name="{{datatypeField}}" href="#">{{datatypeLabel}}</a></li>
                                  {{/availableDataTypeChoices}}
                                  </ul>
                            </div>
                            </div>

                                <div class="col-sm-12 clickOnSectionsWeWant">

                                    <div class='dateChooserContainer'>
                                        <div class="subSectionDescription">
                                            {{dataChoosersTitle}}
                                        </div>
                                        {{#dataChoosers}}
                                        <div>
                                            <input type="checkbox" class="custom-control-input displayControl"
                                                   {{checked}} onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this,'{{identifier}}')">
                                            <label class="custom-control-label displayControl">{{title}}</label>
                                        </div>
                                        {{/dataChoosers}}
                                    </div>
                                </div>




                        </div>
                    </div>
                </div>
                <div class="col-sm-8">
                 <div class="dataChoosingSection">
                     <div class="sectionDescription" style="margin-bottom: 10px">
                       Refine data selection
                    </div>
                    <div class="row">
                        <div class="col-sm-6 clickOnSectionsWeWant">
                            {{#dataFilters}}
                            <div class='dateSliderContainer'>
                                <div class ='form-group' style="margin-left:0">
                                    <label for="{{id}}dateSliderContainer" class="col-sm-2" style="padding: 0">Date:</label>
                                    <div class="col-sm-10"  style="padding-left: 0">
                                        <input type="text" id="{{id}}dateSliderContainer" class="amount" style:10px>
                                    </div>
                                </div>
                                <div class="dateSlider" style="margin: 25px 25px 10px 25px"></div>
                            </div>
                            <div class='startingWithContainer' >
                                 <div class="subSectionDescription">
                                    {{startingWithTitle}}
                                </div>
                                {{#startingWithSection}}
                                    <div>
                                        <label class="custom-control-label displayControl">{{preamble}}
                                        first day with</label>
                                        <input type="text" class="spinner {{className}}"/>
                                        <span class="{{className}}Quantity">{{quantity}}</span>
                                        <span class="{{className}}Suffix">{{postamble}}</span>
                                    </div>
                                {{/startingWithSection}}
                            </div>
                            {{/dataFilters}}
                        </div>
                        <div class="col-sm-6 clickOnSectionsWeWant">
                            <div class="displayTheSectionsWeWant holdTheExpandableBlock" >
                                {{#specificDeactivators}}
                                <div class="everyGroupToDisplayHolder smaller" >
                                    <div class="expander">
                                        <div class="row">
                                            <div class="col-xs-4">
                                                <span class = "pull-left describeWhatWeAreExpanding">{{title}}</span>
                                            </div>
                                            <div class="col-xs-5">
                                                <span>
                                                    <button class = "btn btn-primary btn-xs modifyAllCheckboxes" onclick="mpgSoftware.growthFactorLauncher.modifyAllCheckboxes(this)">ALL</button>
                                                    <button class = "btn btn-primary btn-xs modifyAllCheckboxes" onclick="mpgSoftware.growthFactorLauncher.modifyAllCheckboxes(this)">NONE</button>
                                                </span>

                                            </div>
                                            <div class="col-xs-3">
                                                <span class = "pull-right expanderText" onclick="mpgSoftware.growthFactorLauncher.toggleDisplayOfSelectableElements(this)">Expand</span>
                                            </div>
                                        </div>




                                    </div>
                                    <div class="everyGroupToDisplay"></div>
                                </div>
                                {{/specificDeactivators}}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div class="col-lg-2"></div>
    </div>
    <div class="row col-container">

        <div class="col-lg-5 col-lg-offset-2 col-sm-7 col">
            <div class="dataChoosingSection">
                <div class="sectionDescription">
                    Growth factor analysis
                </div>
                <div class="row">
                    <div class="col-sm-7 clickOnSectionsWeWant">
                        <div class='dateChooserContainer' >
                            <div class="subSectionDescription">
                                {{analysisSelectionTitle}}
                            </div>
                            {{#analysisSelection}}
                                <div>
                                    <input type="checkbox" class="custom-control-input" {{checked}}
                                           onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this,'{{identifier}}')">
                                    <label class="custom-control-label displayControl">{{title}}</label>
                                </div>
                            {{/analysisSelection}}
                        </div>

                    </div>
                    <div class="col-sm-5 clickOnSectionsWeWant">
                        <div class='dateChooserContainer' >
                             <div class="subSectionDescription">
                                {{calculationAdjustmentTitle}}
                            </div>
                            {{#calculationAdjustment}}
                                <div>
                                    <input type="text" class="spinner {{className}}"/>
                                    <label class="custom-control-label displayControl">{{title}}</label>
                                </div>
                            {{/calculationAdjustment}}
                        </div>

                    </div>
                </div>
            </div>


        </div>
        <div class="col-lg-3 col-sm-5 col">
            <div class="displayAdjustmentSection">
                <div class="sectionDescription displayButtonAdjuster {{displayAdjustmentSlim}}">
                    Adjust display
                </div>
                <div class="row">
                {{#displayAdjustment}}
                    <div class="col-sm-{{displayAdjustmentBootstrapSections}}">
                        <div class="text-center" >
                            <button type="button" class="btn btn-outline-primary logLinChg {{displayAdjustmentSlim}} align-middle" onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this)"
                                    style="">{{title}}</button>
                        </div>
                    </div>
                {{/displayAdjustment}}
                {{#displayAdjustmentWithDenominatorSection}}
                    <div class="col-sm-6">
                        {{#clickChoiceSection}}
                        <div class="text-center" >
                            <button type="button" class="btn btn-outline-primary logLinChg {{displayAdjustmentSlim}} align-middle" onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}} (this)"
                                    style="">{{title}}</button>
                        </div>
                        {{/clickChoiceSection}}
                    </div>
                    <div class="col-sm-6">

                        <div class="surroundDenominators text-left">
                        <div class="smallSectionDescription">
                            Denominators
                        </div>
                        {{#radioButtonSection}}
                            <label>
                                <input type="radio" name="chooseDenominator" onclick="mpgSoftware.growthFactorLauncher.{{methodCallBack}}(this)" value="{{value}}" {{default}}>
                                {{title}}
                            </label>
                        {{/radioButtonSection}}
                        </div>
                    </div>
                {{/displayAdjustmentWithDenominatorSection}}
                </div>
            </div>
        </div>
        <div class="col-lg-2 col">
        </div>
    </div>

    <div class="jumbotron" style = "padding: 0">
        {{#plotGoesHere}}
        <div id="{{id}}"></div>
        {{/plotGoesHere}}
    </div>

</div>
{{/.}}
</script>
