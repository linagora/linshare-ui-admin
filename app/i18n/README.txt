Rules for translation:

- Translations are always base on the default one (English)

- Description field is need only for the default translation

- Naming covention : Symbol_Attribute_Variable

- The first letter is a symbol for each type (G : Global, P : Page, C : Component)

- Symbols are followed by an attribute:
    - For 'G', sub types (Btn : Button, 
                          Tab, 
                          App : Application, 
                          Warn : Warning, 
                          Err : Error, 
                          Valid : Validation,
                          Info : Information)
    - For 'P', the page path in camel case
    - For 'C', the component name

- Variables is the name of the text translated, for example 'HomeTitle'.
  For pages and component, precise the type of the text translated, 
    example: 'C_Plupload_BtnClearList'

- Do not re-use translation in another context even if it's the same translation. Create a new one.

- Always check if there is a similar name in order to avoid different naming for similar things.

- Remember keep it simple.
