// Main Menu Keyboard
export const mainMenu = {
  reply_markup: {
    keyboard: [
      ['👛 Wallet Management', '📊 Token Monitoring', '🎯 Auto Sniper'],
      ['⚡ Quick Trade', '📈 Analytics', '⚙️ Settings'],
      ['🛡️ Security', '🔍 Advanced', '📋 Portfolio'],
      ['🚀 Quick Actions', '📊 Market Data']
    ],
    resize_keyboard: true
  }
};

export const advancedMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🔧 Multi-Snipe', callback_data: 'advanced_multisnipe' },
        { text: '📊 TradingView', callback_data: 'advanced_tradingview' }
      ],
      [
        { text: '👥 Copy Trading', callback_data: 'advanced_copytrade' },
        { text: '🤖 Auto Trading', callback_data: 'advanced_autotrade' }
      ],
      [
        { text: '📈 Price Charts', callback_data: 'advanced_charts' },
        { text: '🔔 Smart Alerts', callback_data: 'advanced_alerts' }
      ],
      [
        { text: '📊 LP Analysis', callback_data: 'advanced_lp' },
        { text: '🕵️ Token Analysis', callback_data: 'advanced_analysis' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'advanced_back' }
      ]
    ]
  }
};

export const walletMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🔗 Connect Wallet', callback_data: 'wallet_connect' },
        { text: '💰 Balance', callback_data: 'wallet_balance' }
      ],
      [
        { text: '📊 Portfolio', callback_data: 'wallet_portfolio' },
        { text: '📈 Performance', callback_data: 'wallet_performance' }
      ],
      [
        { text: '👛 Multi-Wallet', callback_data: 'wallet_multi' },
        { text: '🔄 Import/Export', callback_data: 'wallet_import' }
      ],
      [
        { text: '⚡ Quick Actions', callback_data: 'wallet_quick' },
        { text: '🔧 Advanced', callback_data: 'wallet_advanced' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'wallet_back' }
      ]
    ]
  }
};

export const monitorMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '➕ Add Token', callback_data: 'monitor_add' },
        { text: '🗑️ Remove Token', callback_data: 'monitor_remove' }
      ],
      [
        { text: '📋 List Tokens', callback_data: 'monitor_list' },
        { text: '🔍 Token Info', callback_data: 'monitor_info' }
      ],
      [
        { text: '🔔 Price Alerts', callback_data: 'monitor_alerts' },
        { text: '📈 Chart', callback_data: 'monitor_chart' }
      ],
      [
        { text: '⚡ Quick Monitor', callback_data: 'monitor_quick' },
        { text: '🔧 Advanced', callback_data: 'monitor_advanced' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'monitor_back' }
      ]
    ]
  }
};

export const snipeMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🎯 Setup Snipe', callback_data: 'snipe_setup' },
        { text: '🚀 Quick Snipe', callback_data: 'snipe_quick' }
      ],
      [
        { text: '📋 Active Snipes', callback_data: 'snipe_list' },
        { text: '⚡ Multi-Snipe', callback_data: 'snipe_multi' }
      ],
      [
        { text: '🔧 Snipe Templates', callback_data: 'snipe_templates' },
        { text: '📊 Snipe Analytics', callback_data: 'snipe_analytics' }
      ],
      [
        { text: '⚙️ Snipe Settings', callback_data: 'snipe_settings' },
        { text: '🛡️ Safety Rules', callback_data: 'snipe_safety' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'snipe_back' }
      ]
    ]
  }
};

export const tradeMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🟢 Quick Buy', callback_data: 'trade_quick_buy' },
        { text: '🔴 Quick Sell', callback_data: 'trade_quick_sell' }
      ],
      [
        { text: '📈 Limit Order', callback_data: 'trade_limit' },
        { text: '🛑 Stop Loss', callback_data: 'trade_stop' }
      ],
      [
        { text: '🎯 Take Profit', callback_data: 'trade_take' },
        { text: '📊 Batch Trade', callback_data: 'trade_batch' }
      ],
      [
        { text: '🔄 Swap Tokens', callback_data: 'trade_swap' },
        { text: '💧 Add Liquidity', callback_data: 'trade_liquidity' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'trade_back' }
      ]
    ]
  }
};

export const analyticsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '📊 Portfolio', callback_data: 'analytics_portfolio' },
        { text: '📈 Performance', callback_data: 'analytics_performance' }
      ],
      [
        { text: '💰 P&L Report', callback_data: 'analytics_pnl' },
        { text: '📋 Trade History', callback_data: 'analytics_history' }
      ],
      [
        { text: '🔄 Export Data', callback_data: 'analytics_export' },
        { text: '📉 Risk Analysis', callback_data: 'analytics_risk' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'analytics_back' }
      ]
    ]
  }
};

export const settingsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '⚡ Gas Settings', callback_data: 'settings_gas' },
        { text: '📉 Slippage', callback_data: 'settings_slippage' }
      ],
      [
        { text: '🔔 Notifications', callback_data: 'settings_notifications' },
        { text: '🛡️ Security', callback_data: 'settings_security' }
      ],
      [
        { text: '🎯 Trading', callback_data: 'settings_trading' },
        { text: '📊 Display', callback_data: 'settings_display' }
      ],
      [
        { text: '🔄 Reset', callback_data: 'settings_reset' },
        { text: '📝 Preferences', callback_data: 'settings_preferences' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'settings_back' }
      ]
    ]
  }
};

// ADD THE MISSING SECURITY MENU
export const securityMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🔐 Encryption Status', callback_data: 'security_status' },
        { text: '🔄 Session Management', callback_data: 'security_session' }
      ],
      [
        { text: '🚨 Security Alerts', callback_data: 'security_alerts' },
        { text: '📱 2FA Setup', callback_data: 'security_2fa' }
      ],
      [
        { text: '📋 Access Logs', callback_data: 'security_logs' },
        { text: '🛡️ Security Scan', callback_data: 'security_scan' }
      ],
      [
        { text: '🔙 Main Menu', callback_data: 'security_back' }
      ]
    ]
  }
};

// Export all menus as default for easier imports
export default {
  mainMenu,
  advancedMenu,
  walletMenu,
  monitorMenu,
  snipeMenu,
  tradeMenu,
  analyticsMenu,
  settingsMenu,
  securityMenu  // Add securityMenu to default exports
};