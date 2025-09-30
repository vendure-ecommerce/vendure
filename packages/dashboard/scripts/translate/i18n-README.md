# Vendure Dashboard Translation Tool

This tool helps automate and streamline the translation process for the Vendure dashboard interface.

## Features

- 📊 **Translation Analysis** - Get statistics on translation progress
- 🆕 **Language File Creation** - Create new language files from English template
- 🤖 **AI-Assisted Translation** - Generate prompts for AI translation services
- ✋ **Interactive Mode** - Manual translation with guidance
- 🔧 **Batch Processing** - Handle large numbers of translations efficiently

## Quick Start

### 1. Analyze Current Translation Status

```bash
npm run i18n:analyze packages/dashboard/src/i18n/locales/de.po de
```

### 2. Create a New Language File

```bash
npm run i18n:create packages/dashboard/src/i18n/locales/en.po fr
```

### 3. Generate AI Translation Prompts

```bash
npm run i18n:ai-prompts packages/dashboard/src/i18n/locales/fr.po fr
```

### 4. Interactive Translation Mode

```bash
npm run i18n:interactive packages/dashboard/src/i18n/locales/fr.po fr
```

## Supported Languages

The tool includes specific configuration for these languages:

- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)
- 🇮🇹 Italian (it)
- 🇵🇹 Portuguese (pt)
- 🇳🇱 Dutch (nl)
- 🇵🇱 Polish (pl)
- 🇷🇺 Russian (ru)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)

## Workflow Examples

### Adding a New Language (e.g., French)

1. **Create the new language file:**
   ```bash
   npm run i18n:create packages/dashboard/src/i18n/locales/en.po fr
   ```

2. **Check what needs translation:**
   ```bash
   npm run i18n:analyze packages/dashboard/src/i18n/locales/fr.po fr
   ```

3. **Generate AI prompts for batch translation:**
   ```bash
   npm run i18n:ai-prompts packages/dashboard/src/i18n/locales/fr.po fr
   ```

4. **Use the generated prompts with Claude, ChatGPT, or other AI services**

5. **Apply translations and verify:**
   ```bash
   npm run i18n:analyze packages/dashboard/src/i18n/locales/fr.po fr
   ```

### Updating Existing Translations

1. **Check current status:**
   ```bash
   npm run i18n:analyze packages/dashboard/src/i18n/locales/de.po de
   ```

2. **Generate prompts for untranslated entries:**
   ```bash
   npm run i18n:ai-prompts packages/dashboard/src/i18n/locales/de.po de
   ```

3. **Use interactive mode for specific entries:**
   ```bash
   npm run i18n:interactive packages/dashboard/src/i18n/locales/de.po de
   ```

## Translation Guidelines

### General Principles

1. **Preserve Technical Terms**: Keep terms like "API", "GraphQL", "JSON", "SKU" untranslated
2. **Maintain Placeholders**: Never modify placeholders like `{0}`, `{formattedDiff}`, `{entityName}`
3. **Use Formal Address**: Use formal addressing appropriate for business software
4. **Brand Names**: Keep "Vendure" and other brand names untranslated
5. **Context Awareness**: Consider the UI context when translating

### Critical Lingui-Specific Rules

1. **Explicit ID Translations**: For entries marked with "js-lingui-explicit-id" (e.g., `orderState.PartiallyDelivered`), translate ONLY the human-readable part, NOT the namespace:
   - ✅ `"orderState.PartiallyDelivered"` → `"Partiellement livré"` (French)
   - ❌ `"orderState.PartiallyDelivered"` → `"orderState.Partiellement livré"`

2. **E-commerce Domain Context**: Always assume e-commerce context unless clearly indicated otherwise:
   - `"order"` = e-commerce order (goods being purchased)
   - `"customer"` = e-commerce customer (buyer)
   - `"product"` = e-commerce product (item for sale)
   - `"variant"` = product variant (size, color, etc.)

### Language-Specific Guidelines

#### German
- Use "Sie" form (formal addressing)
- Compound words are common in German UI
- Example: "Benutzereinstellungen" instead of "Benutzer Einstellungen"

#### French
- Use formal addressing ("vous" form)
- Pay attention to gender agreement
- Use standard French software terminology

#### Spanish
- Use formal addressing ("usted" form)
- Consider regional variations (use neutral Spanish)
- Follow standard software localization conventions

## AI-Assisted Translation Workflow

The tool generates structured prompts that you can use with AI services:

1. **Run the AI prompts command:**
   ```bash
   npm run i18n:ai-prompts packages/dashboard/src/i18n/locales/es.po es
   ```

2. **Copy the generated prompts** and paste them into your preferred AI service (Claude, ChatGPT, etc.)

3. **Review the AI responses** for accuracy and context appropriateness

4. **Apply the translations** either manually or using the interactive mode

## File Structure

```
packages/dashboard/src/i18n/locales/
├── en.po          # Source English file
├── de.po          # German translations
├── fr.po          # French translations (after creation)
└── ...            # Other language files
```

## Tips for Quality Translations

1. **Test in Context**: Always test translations in the actual UI
2. **Consistency**: Use consistent terminology across the application
3. **Length Considerations**: Some languages are more verbose - ensure UI still works
4. **Cultural Adaptation**: Consider cultural differences in business terminology
5. **Regular Updates**: Keep translations updated when English source changes

## Troubleshooting

### Common Issues

1. **File Not Found**: Ensure the path to the .po file is correct
2. **Parsing Errors**: Check that the .po file format is valid
3. **Language Not Supported**: Add new language configurations in the script

### Getting Help

- Check the script output for detailed error messages
- Review the generated prompts for clarity
- Use the analyze mode to understand translation status

## Contributing

When adding new language support:

1. Add the language configuration to `LANGUAGE_CONFIGS` in the script
2. Test with a sample translation
3. Update this README with the new language
4. Follow the established translation guidelines