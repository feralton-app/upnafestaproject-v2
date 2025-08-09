import { useState, useEffect } from 'react';

export const useSiteColors = () => {
  const [colors, setColors] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyColors = (colorsData) => {
    if (!colorsData) return;
    
    const root = document.documentElement;
    const colorMap = {
      primary: colorsData.primary,
      secondary: colorsData.secondary,
      accent: colorsData.accent,
      background: colorsData.background,
      surface: colorsData.surface,
      textPrimary: colorsData.text_primary,
      textSecondary: colorsData.text_secondary,
      success: colorsData.success,
      warning: colorsData.warning,
      error: colorsData.error,
      border: colorsData.border,
      buttonPrimary: colorsData.button_primary,
      buttonSecondary: colorsData.button_secondary,
      headerBg: colorsData.header_bg,
      headerText: colorsData.header_text,
      inputBorder: colorsData.input_border,
      linkColor: colorsData.link_color,
      hoverColor: colorsData.hover_color
    };
    
    Object.entries(colorMap).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const loadColors = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/admin/site-colors`);
      
      if (response.ok) {
        const colorsData = await response.json();
        setColors(colorsData);
        applyColors(colorsData);
      }
    } catch (error) {
      console.error('Erro ao carregar cores do site:', error);
      // Aplicar cores padrão em caso de erro
      const defaultColors = {
        primary: '#8B4513',
        secondary: '#DEB887',
        accent: '#D2691E',
        background: '#FFF8DC',
        surface: '#FFFFFF',
        text_primary: '#2D1810',
        text_secondary: '#8B4513',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        border: '#E5E7EB',
        button_primary: '#8B4513',
        button_secondary: '#DEB887',
        header_bg: '#8B4513',
        header_text: '#FFFFFF',
        input_border: '#D1D5DB',
        link_color: '#3B82F6',
        hover_color: '#6B3410'
      };
      applyColors(defaultColors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
  }, []);

  return { colors, loading, applyColors, loadColors };
};