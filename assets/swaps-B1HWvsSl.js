import{i as D,a as C,k as P,N as _,x as u,q as V,h as W,R as S,A as j,l as K,M,j as F,W as Q,r as q,e as H}from"./index-C-WFjKWm.js";import{r,n as w,c as U,U as x}from"./if-defined-CwxEgOhH.js";import"./index-CU34gspz.js";import{M as R}from"./index-CeDq_7aG.js";import"./index-CQd9dZrQ.js";import{S as n}from"./index-lZnAqNG5.js";import"./index-DrhJ7VXx.js";import"./index-D8MLCHQN.js";import"./index-BGU1L-NL.js";import"./index-BO-N44rF.js";import"./index-sid_BLjB.js";import"./ref-DwXGo0v1.js";const G={numericInputKeyDown(c,t,e){const i=["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"],a=c.metaKey||c.ctrlKey,o=c.key,s=o.toLocaleLowerCase(),l=s==="a",m=s==="c",v=s==="v",L=s==="x",E=o===",",O=o===".",B=o>="0"&&o<="9";!a&&(l||m||v||L)&&c.preventDefault(),t==="0"&&!E&&!O&&o==="0"&&c.preventDefault(),t==="0"&&B&&(e(o),c.preventDefault()),(E||O)&&(t||(e("0."),c.preventDefault()),(t!=null&&t.includes(".")||t!=null&&t.includes(","))&&c.preventDefault()),!B&&!i.includes(o)&&!O&&!E&&c.preventDefault()}},X=D`
  :host {
    width: 100%;
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    cursor: pointer;
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    padding-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s);
    padding-left: var(--wui-spacing-s);
    padding-right: var(--wui-spacing-1xs);
    border-radius: calc(var(--wui-border-radius-5xs) + var(--wui-border-radius-4xs));
    background: var(--wui-color-gray-glass-002);
  }

  .details-row-title {
    white-space: nowrap;
  }

  .details-row.provider-free-row {
    padding-right: var(--wui-spacing-xs);
  }
`;var k=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};const Y=V.CONVERT_SLIPPAGE_TOLERANCE;let f=class extends C{constructor(){var t;super(),this.unsubscribe=[],this.networkName=(t=P.state.activeCaipNetwork)==null?void 0:t.name,this.detailsOpen=!1,this.sourceToken=n.state.sourceToken,this.toToken=n.state.toToken,this.toTokenAmount=n.state.toTokenAmount,this.sourceTokenPriceInUSD=n.state.sourceTokenPriceInUSD,this.toTokenPriceInUSD=n.state.toTokenPriceInUSD,this.priceImpact=n.state.priceImpact,this.maxSlippage=n.state.maxSlippage,this.networkTokenSymbol=n.state.networkTokenSymbol,this.inputError=n.state.inputError,this.unsubscribe.push(n.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.toTokenAmount=e.toTokenAmount,this.priceImpact=e.priceImpact,this.maxSlippage=e.maxSlippage,this.sourceTokenPriceInUSD=e.sourceTokenPriceInUSD,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.inputError=e.inputError}))}render(){const t=this.toTokenAmount&&this.maxSlippage?_.bigNumber(this.toTokenAmount).minus(this.maxSlippage).toString():null;if(!this.sourceToken||!this.toToken||this.inputError)return null;const e=this.sourceTokenPriceInUSD&&this.toTokenPriceInUSD?1/this.toTokenPriceInUSD*this.sourceTokenPriceInUSD:0;return u`
      <wui-flex flexDirection="column" alignItems="center" gap="1xs" class="details-container">
        <wui-flex flexDirection="column">
          <button @click=${this.toggleDetails.bind(this)}>
            <wui-flex justifyContent="space-between" .padding=${["0","xs","0","xs"]}>
              <wui-flex justifyContent="flex-start" flexGrow="1" gap="xs">
                <wui-text variant="small-400" color="fg-100">
                  1 ${this.sourceToken.symbol} =
                  ${x.formatNumberToLocalString(e,3)}
                  ${this.toToken.symbol}
                </wui-text>
                <wui-text variant="small-400" color="fg-200">
                  $${x.formatNumberToLocalString(this.sourceTokenPriceInUSD)}
                </wui-text>
              </wui-flex>
              <wui-icon name="chevronBottom"></wui-icon>
            </wui-flex>
          </button>
          ${this.detailsOpen?u`
                <wui-flex flexDirection="column" gap="xs" class="details-content-container">
                  ${this.priceImpact?u` <wui-flex flexDirection="column" gap="xs">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="xs">
                            <wui-text class="details-row-title" variant="small-400" color="fg-150">
                              Price impact
                            </wui-text>
                            <w3m-tooltip-trigger
                              text="Price impact reflects the change in market price due to your trade"
                            >
                              <wui-icon size="xs" color="fg-250" name="infoCircle"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="small-400" color="fg-200">
                              ${x.formatNumberToLocalString(this.priceImpact,3)}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  ${this.maxSlippage&&this.sourceToken.symbol?u`<wui-flex flexDirection="column" gap="xs">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="xs">
                            <wui-text class="details-row-title" variant="small-400" color="fg-150">
                              Max. slippage
                            </wui-text>
                            <w3m-tooltip-trigger
                              text=${`Max slippage sets the minimum amount you must receive for the transaction to proceed. ${t?`Transaction will be reversed if you receive less than ${x.formatNumberToLocalString(t,6)} ${this.toToken.symbol} due to price changes.`:""}`}
                            >
                              <wui-icon size="xs" color="fg-250" name="infoCircle"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="small-400" color="fg-200">
                              ${x.formatNumberToLocalString(this.maxSlippage,6)}
                              ${this.toToken.symbol} ${Y}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  <wui-flex flexDirection="column" gap="xs">
                    <wui-flex
                      justifyContent="space-between"
                      alignItems="center"
                      class="details-row provider-free-row"
                    >
                      <wui-flex alignItems="center" gap="xs">
                        <wui-text class="details-row-title" variant="small-400" color="fg-150">
                          Provider fee
                        </wui-text>
                      </wui-flex>
                      <wui-flex>
                        <wui-text variant="small-400" color="fg-200">0.85%</wui-text>
                      </wui-flex>
                    </wui-flex>
                  </wui-flex>
                </wui-flex>
              `:null}
        </wui-flex>
      </wui-flex>
    `}toggleDetails(){this.detailsOpen=!this.detailsOpen}};f.styles=[X];k([r()],f.prototype,"networkName",void 0);k([w()],f.prototype,"detailsOpen",void 0);k([r()],f.prototype,"sourceToken",void 0);k([r()],f.prototype,"toToken",void 0);k([r()],f.prototype,"toTokenAmount",void 0);k([r()],f.prototype,"sourceTokenPriceInUSD",void 0);k([r()],f.prototype,"toTokenPriceInUSD",void 0);k([r()],f.prototype,"priceImpact",void 0);k([r()],f.prototype,"maxSlippage",void 0);k([r()],f.prototype,"networkTokenSymbol",void 0);k([r()],f.prototype,"inputError",void 0);f=k([U("w3m-swap-details")],f);const Z=D`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--wui-border-radius-s);
    padding: var(--wui-spacing-xl);
    padding-right: var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-002);
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    position: relative;
  }

  wui-shimmer.market-value {
    opacity: 0;
  }

  :host > wui-flex > svg.input_mask {
    position: absolute;
    inset: 0;
    z-index: 5;
  }

  :host wui-flex .input_mask__border,
  :host wui-flex .input_mask__background {
    transition: fill var(--wui-duration-md) var(--wui-ease-out-power-1);
    will-change: fill;
  }

  :host wui-flex .input_mask__border {
    fill: var(--wui-color-gray-glass-020);
  }

  :host wui-flex .input_mask__background {
    fill: var(--wui-color-gray-glass-002);
  }
`;var z=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};let N=class extends C{constructor(){super(...arguments),this.target="sourceToken"}render(){return u`
      <wui-flex class justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
          gap="xxs"
        >
          <wui-shimmer width="80px" height="40px" borderRadius="xxs" variant="light"></wui-shimmer>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}templateTokenSelectButton(){return u`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="xxs"
      >
        <wui-shimmer width="80px" height="40px" borderRadius="3xl" variant="light"></wui-shimmer>
      </wui-flex>
    `}};N.styles=[Z];z([w()],N.prototype,"target",void 0);N=z([U("w3m-swap-input-skeleton")],N);const J=D`
  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-xl);
    padding-right: var(--wui-spacing-s);
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-002);
    position: relative;
    transition: box-shadow var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  :host wui-flex.focus {
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-005);
  }

  :host > wui-flex .swap-input,
  :host > wui-flex .swap-token-button {
    z-index: 10;
  }

  :host > wui-flex .swap-input {
    -webkit-mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  :host > wui-flex .swap-input input {
    background: none;
    border: none;
    height: 42px;
    width: 100%;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    letter-spacing: -1.28px;
    outline: none;
    caret-color: var(--wui-color-accent-100);
    color: var(--wui-color-fg-100);
    padding: 0px;
  }

  :host > wui-flex .swap-input input:focus-visible {
    outline: none;
  }

  :host > wui-flex .swap-input input::-webkit-outer-spin-button,
  :host > wui-flex .swap-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .max-value-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--wui-color-gray-glass-020);
    padding-left: 0px;
  }

  .market-value {
    min-height: 18px;
  }
`;var y=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};const tt=5e-5;let b=class extends C{constructor(){super(...arguments),this.focused=!1,this.price=0,this.target="sourceToken",this.onSetAmount=null,this.onSetMaxValue=null}render(){const t=this.marketValue||"0",e=_.bigNumber(t).gt("0");return u`
      <wui-flex class="${this.focused?"focus":""}" justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
        >
          <input
            data-testid="swap-input-${this.target}"
            @focusin=${()=>this.onFocusChange(!0)}
            @focusout=${()=>this.onFocusChange(!1)}
            ?disabled=${this.disabled}
            .value=${this.value}
            @input=${this.dispatchInputChangeEvent}
            @keydown=${this.handleKeydown}
            placeholder="0"
            type="text"
            inputmode="decimal"
          />
          <wui-text class="market-value" variant="small-400" color="fg-200">
            ${e?`$${x.formatNumberToLocalString(this.marketValue,2)}`:null}
          </wui-text>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}handleKeydown(t){return G.numericInputKeyDown(t,this.value,e=>{var i;return(i=this.onSetAmount)==null?void 0:i.call(this,this.target,e)})}dispatchInputChangeEvent(t){if(!this.onSetAmount)return;const e=t.target.value.replace(/[^0-9.]/gu,"");e===","||e==="."?this.onSetAmount(this.target,"0."):e.endsWith(",")?this.onSetAmount(this.target,e.replace(",",".")):this.onSetAmount(this.target,e)}setMaxValueToInput(){var t;(t=this.onSetMaxValue)==null||t.call(this,this.target,this.balance)}templateTokenSelectButton(){return this.token?u`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="xxs"
      >
        <wui-token-button
          data-testid="swap-input-token-${this.target}"
          text=${this.token.symbol}
          imageSrc=${this.token.logoUri}
          @click=${this.onSelectToken.bind(this)}
        >
        </wui-token-button>
        <wui-flex alignItems="center" gap="xxs"> ${this.tokenBalanceTemplate()} </wui-flex>
      </wui-flex>
    `:u` <wui-button
        data-testid="swap-select-token-button-${this.target}"
        class="swap-token-button"
        size="md"
        variant="accent"
        @click=${this.onSelectToken.bind(this)}
      >
        Select token
      </wui-button>`}tokenBalanceTemplate(){const t=_.multiply(this.balance,this.price),e=t?t==null?void 0:t.gt(tt):!1;return u`
      ${e?u`<wui-text variant="small-400" color="fg-200">
            ${x.formatNumberToLocalString(this.balance,2)}
          </wui-text>`:null}
      ${this.target==="sourceToken"?this.tokenActionButtonTemplate(e):null}
    `}tokenActionButtonTemplate(t){return t?u` <button class="max-value-button" @click=${this.setMaxValueToInput.bind(this)}>
        <wui-text color="accent-100" variant="small-600">Max</wui-text>
      </button>`:u` <button class="max-value-button" @click=${this.onBuyToken.bind(this)}>
      <wui-text color="accent-100" variant="small-600">Buy</wui-text>
    </button>`}onFocusChange(t){this.focused=t}onSelectToken(){W.sendEvent({type:"track",event:"CLICK_SELECT_TOKEN_TO_SWAP"}),S.push("SwapSelectToken",{target:this.target})}onBuyToken(){S.push("OnRampProviders")}};b.styles=[J];y([w()],b.prototype,"focused",void 0);y([w()],b.prototype,"balance",void 0);y([w()],b.prototype,"value",void 0);y([w()],b.prototype,"price",void 0);y([w()],b.prototype,"marketValue",void 0);y([w()],b.prototype,"disabled",void 0);y([w()],b.prototype,"target",void 0);y([w()],b.prototype,"token",void 0);y([w()],b.prototype,"onSetAmount",void 0);y([w()],b.prototype,"onSetMaxValue",void 0);b=y([U("w3m-swap-input")],b);const et=D`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .action-button {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
  }

  .action-button:disabled {
    border-color: 1px solid var(--wui-color-gray-glass-005);
  }

  .swap-inputs-container {
    position: relative;
  }

  .replace-tokens-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: var(--wui-spacing-1xs);
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-modal-bg-base);
    padding: var(--wui-spacing-xxs);
  }

  .replace-tokens-button-container > button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    padding: var(--wui-spacing-xs);
    border: none;
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-duration-md) var(--wui-ease-out-power-1);
    will-change: background-color;
    z-index: 20;
  }

  .replace-tokens-button-container > button:hover {
    background: var(--wui-color-gray-glass-005);
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    transition: background 0.2s linear;
  }

  .details-container > wui-flex > button:hover {
    background: var(--wui-color-gray-glass-002);
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }
`;var h=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};let p=class extends C{constructor(){var t,e;super(),this.unsubscribe=[],this.initialParams=(t=S.state.data)==null?void 0:t.swap,this.detailsOpen=!1,this.caipAddress=j.state.caipAddress,this.caipNetworkId=(e=P.state.activeCaipNetwork)==null?void 0:e.caipNetworkId,this.initialized=n.state.initialized,this.loadingQuote=n.state.loadingQuote,this.loadingPrices=n.state.loadingPrices,this.loadingTransaction=n.state.loadingTransaction,this.sourceToken=n.state.sourceToken,this.sourceTokenAmount=n.state.sourceTokenAmount,this.sourceTokenPriceInUSD=n.state.sourceTokenPriceInUSD,this.toToken=n.state.toToken,this.toTokenAmount=n.state.toTokenAmount,this.toTokenPriceInUSD=n.state.toTokenPriceInUSD,this.inputError=n.state.inputError,this.fetchError=n.state.fetchError,this.lastTokenPriceUpdate=0,this.minTokenPriceUpdateInterval=1e4,this.visibilityChangeHandler=()=>{document!=null&&document.hidden?(clearInterval(this.interval),this.interval=void 0):this.startTokenPriceInterval()},this.startTokenPriceInterval=()=>{this.interval&&Date.now()-this.lastTokenPriceUpdate<this.minTokenPriceUpdateInterval||(this.lastTokenPriceUpdate&&Date.now()-this.lastTokenPriceUpdate>this.minTokenPriceUpdateInterval&&this.fetchTokensAndValues(),clearInterval(this.interval),this.interval=setInterval(()=>{this.fetchTokensAndValues()},this.minTokenPriceUpdateInterval))},this.watchTokensAndValues=()=>{!this.sourceToken||!this.toToken||(this.subscribeToVisibilityChange(),this.startTokenPriceInterval())},this.onDebouncedGetSwapCalldata=K.debounce(async()=>{await n.swapTokens()},200),P.subscribeKey("activeCaipNetwork",i=>this.onCaipNetworkChange({newCaipNetwork:i,resetSwapState:!0,initializeSwapState:!1})),j.subscribeKey("caipAddress",i=>this.onCaipAddressChange({newCaipAddress:i,resetSwapState:!0,initializeSwapState:!1})),this.unsubscribe.push(P.subscribeKey("activeCaipNetwork",i=>this.onCaipNetworkChange({newCaipNetwork:i,resetSwapState:!1,initializeSwapState:!0})),j.subscribeKey("caipAddress",i=>this.onCaipAddressChange({newCaipAddress:i,resetSwapState:!1,initializeSwapState:!0})),M.subscribeKey("open",i=>{i||n.resetState()}),S.subscribeKey("view",i=>{i.includes("Swap")||n.resetValues()}),n.subscribe(i=>{this.initialized=i.initialized,this.loadingQuote=i.loadingQuote,this.loadingPrices=i.loadingPrices,this.loadingTransaction=i.loadingTransaction,this.sourceToken=i.sourceToken,this.sourceTokenAmount=i.sourceTokenAmount,this.sourceTokenPriceInUSD=i.sourceTokenPriceInUSD,this.toToken=i.toToken,this.toTokenAmount=i.toTokenAmount,this.toTokenPriceInUSD=i.toTokenPriceInUSD,this.inputError=i.inputError,this.fetchError=i.fetchError,i.sourceToken&&i.toToken&&this.watchTokensAndValues()}))}async firstUpdated(){n.initializeState(),this.watchTokensAndValues(),await this.handleSwapParameters()}disconnectedCallback(){this.unsubscribe.forEach(t=>t==null?void 0:t()),clearInterval(this.interval),document==null||document.removeEventListener("visibilitychange",this.visibilityChangeHandler)}render(){return u`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
        ${this.initialized?this.templateSwap():this.templateLoading()}
      </wui-flex>
    `}subscribeToVisibilityChange(){document==null||document.removeEventListener("visibilitychange",this.visibilityChangeHandler),document==null||document.addEventListener("visibilitychange",this.visibilityChangeHandler)}fetchTokensAndValues(){n.getNetworkTokenPrice(),n.getMyTokensWithBalance(),n.swapTokens(),this.lastTokenPriceUpdate=Date.now()}templateSwap(){return u`
      <wui-flex flexDirection="column" gap="s">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          ${this.templateTokenInput("sourceToken",this.sourceToken)}
          ${this.templateTokenInput("toToken",this.toToken)} ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateDetails()} ${this.templateActionButton()}
      </wui-flex>
    `}actionButtonLabel(){return this.fetchError?"Swap":!this.sourceToken||!this.toToken?"Select token":this.sourceTokenAmount?this.inputError?this.inputError:"Review swap":"Enter amount"}templateReplaceTokensButton(){return u`
      <wui-flex class="replace-tokens-button-container">
        <button @click=${this.onSwitchTokens.bind(this)}>
          <wui-icon name="recycleHorizontal" color="fg-250" size="lg"></wui-icon>
        </button>
      </wui-flex>
    `}templateLoading(){return u`
      <wui-flex flexDirection="column" gap="l">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          <w3m-swap-input-skeleton target="sourceToken"></w3m-swap-input-skeleton>
          <w3m-swap-input-skeleton target="toToken"></w3m-swap-input-skeleton>
          ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateActionButton()}
      </wui-flex>
    `}templateTokenInput(t,e){var l,m;const i=(l=n.state.myTokensWithBalance)==null?void 0:l.find(v=>(v==null?void 0:v.address)===(e==null?void 0:e.address)),a=t==="toToken"?this.toTokenAmount:this.sourceTokenAmount,o=t==="toToken"?this.toTokenPriceInUSD:this.sourceTokenPriceInUSD,s=_.parseLocalStringToNumber(a)*o;return u`<w3m-swap-input
      .value=${t==="toToken"?this.toTokenAmount:this.sourceTokenAmount}
      .disabled=${t==="toToken"}
      .onSetAmount=${this.handleChangeAmount.bind(this)}
      target=${t}
      .token=${e}
      .balance=${(m=i==null?void 0:i.quantity)==null?void 0:m.numeric}
      .price=${i==null?void 0:i.price}
      .marketValue=${s}
      .onSetMaxValue=${this.onSetMaxValue.bind(this)}
    ></w3m-swap-input>`}onSetMaxValue(t,e){const i=_.bigNumber(e||"0");this.handleChangeAmount(t,i.gt(0)?i.toFixed(20):"0")}templateDetails(){return!this.sourceToken||!this.toToken||this.inputError?null:u`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`}handleChangeAmount(t,e){n.clearError(),t==="sourceToken"?n.setSourceTokenAmount(e):n.setToTokenAmount(e),this.onDebouncedGetSwapCalldata()}templateActionButton(){const t=!this.toToken||!this.sourceToken,e=!this.sourceTokenAmount,i=this.loadingQuote||this.loadingPrices||this.loadingTransaction,a=i||t||e||this.inputError;return u` <wui-flex gap="xs">
      <wui-button
        data-testid="swap-action-button"
        class="action-button"
        fullWidth
        size="lg"
        borderRadius="xs"
        variant=${t?"neutral":"main"}
        .loading=${i}
        .disabled=${a}
        @click=${this.onSwapPreview.bind(this)}
      >
        ${this.actionButtonLabel()}
      </wui-button>
    </wui-flex>`}onSwitchTokens(){n.switchTokens()}async onSwapPreview(){var t,e;this.fetchError&&await n.swapTokens(),W.sendEvent({type:"track",event:"INITIATE_SWAP",properties:{network:this.caipNetworkId||"",swapFromToken:((t=this.sourceToken)==null?void 0:t.symbol)||"",swapToToken:((e=this.toToken)==null?void 0:e.symbol)||"",swapFromAmount:this.sourceTokenAmount||"",swapToAmount:this.toTokenAmount||"",isSmartAccount:F(P.state.activeChain)===Q.ACCOUNT_TYPES.SMART_ACCOUNT}}),S.push("SwapPreview")}async handleSwapParameters(){this.initialParams&&(n.state.initialized||await new Promise(e=>{const i=n.subscribeKey("initialized",a=>{a&&(i==null||i(),e())})}),await this.setSwapParameters(this.initialParams))}async setSwapParameters({amount:t,fromToken:e,toToken:i}){(!n.state.tokens||!n.state.myTokensWithBalance)&&await new Promise(s=>{const l=n.subscribeKey("myTokensWithBalance",m=>{m&&m.length>0&&(l==null||l(),s())});setTimeout(()=>{l==null||l(),s()},5e3)});const a=[...n.state.tokens||[],...n.state.myTokensWithBalance||[]];if(e){const o=a.find(s=>s.symbol.toLowerCase()===e.toLowerCase());o&&n.setSourceToken(o)}if(i){const o=a.find(s=>s.symbol.toLowerCase()===i.toLowerCase());o&&n.setToToken(o)}t&&!isNaN(Number(t))&&n.setSourceTokenAmount(t)}onCaipAddressChange({newCaipAddress:t,resetSwapState:e,initializeSwapState:i}){this.caipAddress!==t&&(this.caipAddress=t,e&&n.resetState(),i&&n.initializeState())}onCaipNetworkChange({newCaipNetwork:t,resetSwapState:e,initializeSwapState:i}){this.caipNetworkId!==(t==null?void 0:t.caipNetworkId)&&(this.caipNetworkId=t==null?void 0:t.caipNetworkId,e&&n.resetState(),i&&n.initializeState())}};p.styles=et;h([w({type:Object})],p.prototype,"initialParams",void 0);h([r()],p.prototype,"interval",void 0);h([r()],p.prototype,"detailsOpen",void 0);h([r()],p.prototype,"caipAddress",void 0);h([r()],p.prototype,"caipNetworkId",void 0);h([r()],p.prototype,"initialized",void 0);h([r()],p.prototype,"loadingQuote",void 0);h([r()],p.prototype,"loadingPrices",void 0);h([r()],p.prototype,"loadingTransaction",void 0);h([r()],p.prototype,"sourceToken",void 0);h([r()],p.prototype,"sourceTokenAmount",void 0);h([r()],p.prototype,"sourceTokenPriceInUSD",void 0);h([r()],p.prototype,"toToken",void 0);h([r()],p.prototype,"toTokenAmount",void 0);h([r()],p.prototype,"toTokenPriceInUSD",void 0);h([r()],p.prototype,"inputError",void 0);h([r()],p.prototype,"fetchError",void 0);h([r()],p.prototype,"lastTokenPriceUpdate",void 0);p=h([U("w3m-swap-view")],p);const it=D`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  .preview-container,
  .details-container {
    width: 100%;
  }

  .token-image {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: 12px;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .token-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    height: 40px;
    border: none;
    border-radius: 80px;
    background: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    cursor: pointer;
    transition: background 0.2s linear;
  }

  .token-item:hover {
    background: var(--wui-color-gray-glass-005);
  }

  .preview-token-details-container {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }

  .action-buttons-container {
    width: 100%;
    gap: var(--wui-spacing-xs);
  }

  .action-buttons-container > button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    height: 48px;
    border-radius: var(--wui-border-radius-xs);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  .action-buttons-container > button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .action-button > wui-loading-spinner {
    display: inline-block;
  }

  .cancel-button:hover,
  .action-button:hover {
    cursor: pointer;
  }

  .action-buttons-container > wui-button.cancel-button {
    flex: 2;
  }

  .action-buttons-container > wui-button.action-button {
    flex: 4;
  }

  .action-buttons-container > button.action-button > wui-text {
    color: white;
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    transition: background 0.2s linear;
  }

  .details-container > wui-flex > button:hover {
    background: var(--wui-color-gray-glass-002);
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }
`;var g=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};let d=class extends C{constructor(){super(),this.unsubscribe=[],this.detailsOpen=!0,this.approvalTransaction=n.state.approvalTransaction,this.swapTransaction=n.state.swapTransaction,this.sourceToken=n.state.sourceToken,this.sourceTokenAmount=n.state.sourceTokenAmount??"",this.sourceTokenPriceInUSD=n.state.sourceTokenPriceInUSD,this.toToken=n.state.toToken,this.toTokenAmount=n.state.toTokenAmount??"",this.toTokenPriceInUSD=n.state.toTokenPriceInUSD,this.caipNetwork=P.state.activeCaipNetwork,this.balanceSymbol=j.state.balanceSymbol,this.inputError=n.state.inputError,this.loadingQuote=n.state.loadingQuote,this.loadingApprovalTransaction=n.state.loadingApprovalTransaction,this.loadingBuildTransaction=n.state.loadingBuildTransaction,this.loadingTransaction=n.state.loadingTransaction,this.unsubscribe.push(j.subscribeKey("balanceSymbol",t=>{this.balanceSymbol!==t&&S.goBack()}),P.subscribeKey("activeCaipNetwork",t=>{this.caipNetwork!==t&&(this.caipNetwork=t)}),n.subscribe(t=>{this.approvalTransaction=t.approvalTransaction,this.swapTransaction=t.swapTransaction,this.sourceToken=t.sourceToken,this.toToken=t.toToken,this.toTokenPriceInUSD=t.toTokenPriceInUSD,this.sourceTokenAmount=t.sourceTokenAmount??"",this.toTokenAmount=t.toTokenAmount??"",this.inputError=t.inputError,t.inputError&&S.goBack(),this.loadingQuote=t.loadingQuote,this.loadingApprovalTransaction=t.loadingApprovalTransaction,this.loadingBuildTransaction=t.loadingBuildTransaction,this.loadingTransaction=t.loadingTransaction}))}firstUpdated(){n.getTransaction(),this.refreshTransaction()}disconnectedCallback(){this.unsubscribe.forEach(t=>t==null?void 0:t()),clearInterval(this.interval)}render(){return u`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
        ${this.templateSwap()}
      </wui-flex>
    `}refreshTransaction(){this.interval=setInterval(()=>{n.getApprovalLoadingState()||n.getTransaction()},1e4)}templateSwap(){var m,v,L,E;const t=`${x.formatNumberToLocalString(parseFloat(this.sourceTokenAmount))} ${(m=this.sourceToken)==null?void 0:m.symbol}`,e=`${x.formatNumberToLocalString(parseFloat(this.toTokenAmount))} ${(v=this.toToken)==null?void 0:v.symbol}`,i=parseFloat(this.sourceTokenAmount)*this.sourceTokenPriceInUSD,a=parseFloat(this.toTokenAmount)*this.toTokenPriceInUSD,o=x.formatNumberToLocalString(i),s=x.formatNumberToLocalString(a),l=this.loadingQuote||this.loadingBuildTransaction||this.loadingTransaction||this.loadingApprovalTransaction;return u`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        <wui-flex class="preview-container" flexDirection="column" alignItems="flex-start" gap="l">
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="l"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="4xs">
              <wui-text variant="small-400" color="fg-150">Send</wui-text>
              <wui-text variant="paragraph-400" color="fg-100">$${o}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${t}
              imageSrc=${(L=this.sourceToken)==null?void 0:L.logoUri}
            >
            </wui-token-button>
          </wui-flex>
          <wui-icon name="recycleHorizontal" color="fg-200" size="md"></wui-icon>
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="l"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="4xs">
              <wui-text variant="small-400" color="fg-150">Receive</wui-text>
              <wui-text variant="paragraph-400" color="fg-100">$${s}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${e}
              imageSrc=${(E=this.toToken)==null?void 0:E.logoUri}
            >
            </wui-token-button>
          </wui-flex>
        </wui-flex>

        ${this.templateDetails()}

        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
          <wui-icon size="sm" color="fg-200" name="infoCircle"></wui-icon>
          <wui-text variant="small-400" color="fg-200">Review transaction carefully</wui-text>
        </wui-flex>

        <wui-flex
          class="action-buttons-container"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="xs"
        >
          <wui-button
            class="cancel-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="neutral"
            @click=${this.onCancelTransaction.bind(this)}
          >
            <wui-text variant="paragraph-600" color="fg-200">Cancel</wui-text>
          </wui-button>
          <wui-button
            class="action-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="main"
            ?loading=${l}
            ?disabled=${l}
            @click=${this.onSendTransaction.bind(this)}
          >
            <wui-text variant="paragraph-600" color="inverse-100">
              ${this.actionButtonLabel()}
            </wui-text>
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}templateDetails(){return!this.sourceToken||!this.toToken||this.inputError?null:u`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`}actionButtonLabel(){return this.loadingApprovalTransaction?"Approving...":this.approvalTransaction?"Approve":"Swap"}onCancelTransaction(){S.goBack()}onSendTransaction(){this.approvalTransaction?n.sendTransactionForApproval(this.approvalTransaction):n.sendTransactionForSwap(this.swapTransaction)}};d.styles=it;g([r()],d.prototype,"interval",void 0);g([r()],d.prototype,"detailsOpen",void 0);g([r()],d.prototype,"approvalTransaction",void 0);g([r()],d.prototype,"swapTransaction",void 0);g([r()],d.prototype,"sourceToken",void 0);g([r()],d.prototype,"sourceTokenAmount",void 0);g([r()],d.prototype,"sourceTokenPriceInUSD",void 0);g([r()],d.prototype,"toToken",void 0);g([r()],d.prototype,"toTokenAmount",void 0);g([r()],d.prototype,"toTokenPriceInUSD",void 0);g([r()],d.prototype,"caipNetwork",void 0);g([r()],d.prototype,"balanceSymbol",void 0);g([r()],d.prototype,"inputError",void 0);g([r()],d.prototype,"loadingQuote",void 0);g([r()],d.prototype,"loadingApprovalTransaction",void 0);g([r()],d.prototype,"loadingBuildTransaction",void 0);g([r()],d.prototype,"loadingTransaction",void 0);d=g([U("w3m-swap-preview-view")],d);const ot=D`
  :host {
    height: 60px;
    min-height: 60px;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    display: flex;
    column-gap: var(--wui-spacing-s);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-l);
    width: 100%;
    background-color: transparent;
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      background-color var(--wui-ease-out-power-1) var(--wui-duration-lg),
      opacity var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color, opacity;
  }

  @media (hover: hover) and (pointer: fine) {
    :host > wui-flex:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    :host > wui-flex:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  :host([disabled]) > wui-flex {
    opacity: 0.6;
  }

  :host([disabled]) > wui-flex:hover {
    background-color: transparent;
  }

  :host > wui-flex > wui-flex {
    flex: 1;
  }

  :host > wui-flex > wui-image,
  :host > wui-flex > .token-item-image-placeholder {
    width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    position: relative;
  }

  :host > wui-flex > .token-item-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host > wui-flex > wui-image::after,
  :host > wui-flex > .token-item-image-placeholder::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-l);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }
`;var A=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};let $=class extends C{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.imageSrc=void 0,this.name=void 0,this.symbol=void 0,this.price=void 0,this.amount=void 0,this.visible=!1,this.imageError=!1,this.observer=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting?this.visible=!0:this.visible=!1})},{threshold:.1})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){var e;if(!this.visible)return null;const t=this.amount&&this.price?(e=_.multiply(this.price,this.amount))==null?void 0:e.toFixed(3):null;return u`
      <wui-flex alignItems="center">
        ${this.visualTemplate()}
        <wui-flex flexDirection="column" gap="3xs">
          <wui-flex justifyContent="space-between">
            <wui-text variant="paragraph-500" color="fg-100" lineClamp="1">${this.name}</wui-text>
            ${t?u`
                  <wui-text variant="paragraph-500" color="fg-100">
                    $${x.formatNumberToLocalString(t,3)}
                  </wui-text>
                `:null}
          </wui-flex>
          <wui-flex justifyContent="space-between">
            <wui-text variant="small-400" color="fg-200" lineClamp="1">${this.symbol}</wui-text>
            ${this.amount?u`<wui-text variant="small-400" color="fg-200">
                  ${x.formatNumberToLocalString(this.amount,3)}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}visualTemplate(){return this.imageError?u`<wui-flex class="token-item-image-placeholder">
        <wui-icon name="image" color="inherit"></wui-icon>
      </wui-flex>`:this.imageSrc?u`<wui-image
        width="40"
        height="40"
        src=${this.imageSrc}
        @onLoadError=${this.imageLoadError}
      ></wui-image>`:null}imageLoadError(){this.imageError=!0}};$.styles=[q,H,ot];A([w()],$.prototype,"imageSrc",void 0);A([w()],$.prototype,"name",void 0);A([w()],$.prototype,"symbol",void 0);A([w()],$.prototype,"price",void 0);A([w()],$.prototype,"amount",void 0);A([r()],$.prototype,"visible",void 0);A([r()],$.prototype,"imageError",void 0);$=A([U("wui-token-list-item")],$);const nt=D`
  :host {
    --tokens-scroll--top-opacity: 0;
    --tokens-scroll--bottom-opacity: 1;
    --suggested-tokens-scroll--left-opacity: 0;
    --suggested-tokens-scroll--right-opacity: 1;
  }

  :host > wui-flex:first-child {
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    scrollbar-height: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .suggested-tokens-container {
    overflow-x: auto;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--suggested-tokens-scroll--right-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--right-opacity))) 100%
    );
  }

  .suggested-tokens-container::-webkit-scrollbar {
    display: none;
  }

  .tokens-container {
    border-top: 1px solid var(--wui-color-gray-glass-005);
    height: 100%;
    max-height: 390px;
  }

  .tokens {
    width: 100%;
    overflow-y: auto;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--tokens-scroll--top-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--tokens-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--bottom-opacity))) 100%
    );
  }

  .network-search-input,
  .select-network-button {
    height: 40px;
  }

  .select-network-button {
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: transparent;
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-xs);
    align-items: center;
    transition: background-color 0.2s linear;
  }

  .select-network-button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  .select-network-button > wui-image {
    width: 26px;
    height: 26px;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`;var I=function(c,t,e,i){var a=arguments.length,o=a<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,i);else for(var l=c.length-1;l>=0;l--)(s=c[l])&&(o=(a<3?s(o):a>3?s(t,e,o):s(t,e))||o);return a>3&&o&&Object.defineProperty(t,e,o),o};let T=class extends C{constructor(){var t;super(),this.unsubscribe=[],this.targetToken=(t=S.state.data)==null?void 0:t.target,this.sourceToken=n.state.sourceToken,this.sourceTokenAmount=n.state.sourceTokenAmount,this.toToken=n.state.toToken,this.myTokensWithBalance=n.state.myTokensWithBalance,this.popularTokens=n.state.popularTokens,this.searchValue="",this.unsubscribe.push(n.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.myTokensWithBalance=e.myTokensWithBalance}))}updated(){var i,a;const t=(i=this.renderRoot)==null?void 0:i.querySelector(".suggested-tokens-container");t==null||t.addEventListener("scroll",this.handleSuggestedTokensScroll.bind(this));const e=(a=this.renderRoot)==null?void 0:a.querySelector(".tokens");e==null||e.addEventListener("scroll",this.handleTokenListScroll.bind(this))}disconnectedCallback(){var i,a;super.disconnectedCallback();const t=(i=this.renderRoot)==null?void 0:i.querySelector(".suggested-tokens-container"),e=(a=this.renderRoot)==null?void 0:a.querySelector(".tokens");t==null||t.removeEventListener("scroll",this.handleSuggestedTokensScroll.bind(this)),e==null||e.removeEventListener("scroll",this.handleTokenListScroll.bind(this)),clearInterval(this.interval)}render(){return u`
      <wui-flex flexDirection="column" gap="s">
        ${this.templateSearchInput()} ${this.templateSuggestedTokens()} ${this.templateTokens()}
      </wui-flex>
    `}onSelectToken(t){this.targetToken==="sourceToken"?n.setSourceToken(t):(n.setToToken(t),this.sourceToken&&this.sourceTokenAmount&&n.swapTokens()),S.goBack()}templateSearchInput(){return u`
      <wui-flex .padding=${["3xs","s","0","s"]} gap="xs">
        <wui-input-text
          data-testid="swap-select-token-search-input"
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
          .value=${this.searchValue}
          @inputChange=${this.onSearchInputChange.bind(this)}
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){const t=this.myTokensWithBalance?Object.values(this.myTokensWithBalance):[],e=this.popularTokens?this.popularTokens:[],i=this.filterTokensWithText(t,this.searchValue),a=this.filterTokensWithText(e,this.searchValue);return u`
      <wui-flex class="tokens-container">
        <wui-flex class="tokens" .padding=${["0","s","s","s"]} flexDirection="column">
          ${(i==null?void 0:i.length)>0?u`
                <wui-flex justifyContent="flex-start" padding="s">
                  <wui-text variant="paragraph-500" color="fg-200">Your tokens</wui-text>
                </wui-flex>
                ${i.map(o=>{var l,m,v;const s=o.symbol===((l=this.sourceToken)==null?void 0:l.symbol)||o.symbol===((m=this.toToken)==null?void 0:m.symbol);return u`
                    <wui-token-list-item
                      data-testid="swap-select-token-item-${o.symbol}"
                      name=${o.name}
                      ?disabled=${s}
                      symbol=${o.symbol}
                      price=${o==null?void 0:o.price}
                      amount=${(v=o==null?void 0:o.quantity)==null?void 0:v.numeric}
                      imageSrc=${o.logoUri}
                      @click=${()=>{s||this.onSelectToken(o)}}
                    >
                    </wui-token-list-item>
                  `})}
              `:null}

          <wui-flex justifyContent="flex-start" padding="s">
            <wui-text variant="paragraph-500" color="fg-200">Tokens</wui-text>
          </wui-flex>
          ${(a==null?void 0:a.length)>0?a.map(o=>u`
                  <wui-token-list-item
                    data-testid="swap-select-token-item-${o.symbol}"
                    name=${o.name}
                    symbol=${o.symbol}
                    imageSrc=${o.logoUri}
                    @click=${()=>this.onSelectToken(o)}
                  >
                  </wui-token-list-item>
                `):null}
        </wui-flex>
      </wui-flex>
    `}templateSuggestedTokens(){const t=n.state.suggestedTokens?n.state.suggestedTokens.slice(0,8):null;return t?u`
      <wui-flex class="suggested-tokens-container" .padding=${["0","s","0","s"]} gap="xs">
        ${t.map(e=>u`
            <wui-token-button
              text=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-button>
          `)}
      </wui-flex>
    `:null}onSearchInputChange(t){this.searchValue=t.detail}handleSuggestedTokensScroll(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector(".suggested-tokens-container");t&&(t.style.setProperty("--suggested-tokens-scroll--left-opacity",R.interpolate([0,100],[0,1],t.scrollLeft).toString()),t.style.setProperty("--suggested-tokens-scroll--right-opacity",R.interpolate([0,100],[0,1],t.scrollWidth-t.scrollLeft-t.offsetWidth).toString()))}handleTokenListScroll(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector(".tokens");t&&(t.style.setProperty("--tokens-scroll--top-opacity",R.interpolate([0,100],[0,1],t.scrollTop).toString()),t.style.setProperty("--tokens-scroll--bottom-opacity",R.interpolate([0,100],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString()))}filterTokensWithText(t,e){return t.filter(i=>`${i.symbol} ${i.name} ${i.address}`.toLowerCase().includes(e.toLowerCase()))}};T.styles=nt;I([r()],T.prototype,"interval",void 0);I([r()],T.prototype,"targetToken",void 0);I([r()],T.prototype,"sourceToken",void 0);I([r()],T.prototype,"sourceTokenAmount",void 0);I([r()],T.prototype,"toToken",void 0);I([r()],T.prototype,"myTokensWithBalance",void 0);I([r()],T.prototype,"popularTokens",void 0);I([r()],T.prototype,"searchValue",void 0);T=I([U("w3m-swap-select-token-view")],T);export{d as W3mSwapPreviewView,T as W3mSwapSelectTokenView,p as W3mSwapView};
