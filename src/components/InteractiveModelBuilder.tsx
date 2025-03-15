
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Code } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import CodeBlock from './CodeBlock';
import { useToast } from '@/hooks/use-toast';

interface Field {
  name: string;
  type: string;
  required: boolean;
  options: {
    max_length?: string;
    default?: string;
    unique?: boolean;
    blank?: boolean;
    null?: boolean;
    choices?: string;
  };
}

const fieldTypes = [
  "CharField", "TextField", "IntegerField", "BooleanField", 
  "DateField", "DateTimeField", "EmailField", "FileField",
  "ImageField", "URLField", "ForeignKey", "ManyToManyField",
  "OneToOneField", "DecimalField", "SlugField", "UUIDField"
];

const InteractiveModelBuilder: React.FC = () => {
  const [modelName, setModelName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showCode, setShowCode] = useState(false);
  const { toast } = useToast();

  const addField = () => {
    setFields([...fields, {
      name: 'new_field',
      type: 'CharField',
      required: true,
      options: {
        max_length: '255'
      }
    }]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    setSelectedField(null);
  };

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
  };

  const handleFieldUpdate = (index: number, updatedField: Field) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
    setSelectedField(updatedField);
  };

  const generateModelCode = (): string => {
    if (!modelName.trim()) {
      return '# Please provide a model name';
    }

    const modelNameCamelCase = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    
    let code = `from django.db import models\n\n`;
    
    if (fields.some(f => f.type === 'UUIDField')) {
      code += `import uuid\n\n`;
    }
    
    code += `class ${modelNameCamelCase}(models.Model):\n`;
    
    if (fields.length === 0) {
      code += '    # Add model fields here\n    pass\n';
    } else {
      fields.forEach(field => {
        let fieldOptions = [];
        
        if (field.options.max_length && ['CharField', 'TextField', 'SlugField'].includes(field.type)) {
          fieldOptions.push(`max_length=${field.options.max_length}`);
        }
        
        if (field.options.default) {
          if (['CharField', 'TextField', 'EmailField', 'URLField', 'SlugField'].includes(field.type)) {
            fieldOptions.push(`default="${field.options.default}"`);
          } else {
            fieldOptions.push(`default=${field.options.default}`);
          }
        }
        
        if (field.options.unique) {
          fieldOptions.push('unique=True');
        }
        
        if (field.options.blank) {
          fieldOptions.push('blank=True');
        }
        
        if (field.options.null) {
          fieldOptions.push('null=True');
        }
        
        if (field.options.choices && field.options.choices.trim()) {
          fieldOptions.push(`choices=${field.options.choices}`);
        }
        
        if (field.type === 'ForeignKey' || field.type === 'OneToOneField') {
          code += `    ${field.name} = models.${field.type}('RelatedModel', on_delete=models.CASCADE, ${fieldOptions.join(', ')})\n`;
        } else if (field.type === 'ManyToManyField') {
          code += `    ${field.name} = models.${field.type}('RelatedModel', ${fieldOptions.join(', ')})\n`;
        } else {
          code += `    ${field.name} = models.${field.type}(${fieldOptions.join(', ')})\n`;
        }
      });
      
      code += '\n    def __str__(self):\n';
      const strField = fields.find(f => ['CharField', 'TextField', 'SlugField'].includes(f.type));
      
      if (strField) {
        code += `        return self.${strField.name}\n`;
      } else {
        code += `        return f"${modelNameCamelCase} {self.id}"\n`;
      }
      
      code += '\n    class Meta:\n';
      code += `        verbose_name_plural = "${modelNameCamelCase}s"\n`;
      code += '        ordering = ["-id"]\n';
    }
    
    return code;
  };

  const handleSaveModel = () => {
    if (!modelName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a model name",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Model created",
      description: `${modelName} model has been successfully created!`,
    });
    
    setShowCode(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Model Builder</CardTitle>
          <CardDescription>Create your Django model by defining fields and properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                placeholder="e.g. Product, Article, User"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fields list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Fields</h3>
                  <Button variant="outline" size="sm" onClick={addField}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                  {fields.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No fields added yet
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div
                        key={index}
                        className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${
                          selectedField === field ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleFieldSelect(field)}
                      >
                        <div>
                          <div className="font-medium text-sm">{field.name}</div>
                          <div className="text-xs text-gray-500">{field.type}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Field details */}
              <div className="md:col-span-2 border rounded-md p-4">
                {selectedField ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Field Properties</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="field-name">Name</Label>
                        <Input
                          id="field-name"
                          value={selectedField.name}
                          onChange={(e) => {
                            const index = fields.findIndex(f => f === selectedField);
                            handleFieldUpdate(index, {
                              ...selectedField,
                              name: e.target.value
                            });
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="field-type">Type</Label>
                        <Select
                          value={selectedField.type}
                          onValueChange={(value) => {
                            const index = fields.findIndex(f => f === selectedField);
                            handleFieldUpdate(index, {
                              ...selectedField,
                              type: value
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="field-required"
                          checked={selectedField.required}
                          onCheckedChange={(checked) => {
                            const index = fields.findIndex(f => f === selectedField);
                            handleFieldUpdate(index, {
                              ...selectedField,
                              required: checked === true
                            });
                          }}
                        />
                        <Label htmlFor="field-required">Required</Label>
                      </div>
                      
                      <Separator />
                      
                      <h4 className="text-sm font-medium">Options</h4>
                      
                      {['CharField', 'TextField', 'SlugField'].includes(selectedField.type) && (
                        <div>
                          <Label htmlFor="max-length">Max Length</Label>
                          <Input
                            id="max-length"
                            type="number"
                            value={selectedField.options.max_length || ''}
                            onChange={(e) => {
                              const index = fields.findIndex(f => f === selectedField);
                              handleFieldUpdate(index, {
                                ...selectedField,
                                options: {
                                  ...selectedField.options,
                                  max_length: e.target.value
                                }
                              });
                            }}
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="field-default">Default Value</Label>
                        <Input
                          id="field-default"
                          value={selectedField.options.default || ''}
                          onChange={(e) => {
                            const index = fields.findIndex(f => f === selectedField);
                            handleFieldUpdate(index, {
                              ...selectedField,
                              options: {
                                ...selectedField.options,
                                default: e.target.value
                              }
                            });
                          }}
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="field-unique"
                            checked={selectedField.options.unique || false}
                            onCheckedChange={(checked) => {
                              const index = fields.findIndex(f => f === selectedField);
                              handleFieldUpdate(index, {
                                ...selectedField,
                                options: {
                                  ...selectedField.options,
                                  unique: checked === true
                                }
                              });
                            }}
                          />
                          <Label htmlFor="field-unique">Unique</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="field-blank"
                            checked={selectedField.options.blank || false}
                            onCheckedChange={(checked) => {
                              const index = fields.findIndex(f => f === selectedField);
                              handleFieldUpdate(index, {
                                ...selectedField,
                                options: {
                                  ...selectedField.options,
                                  blank: checked === true
                                }
                              });
                            }}
                          />
                          <Label htmlFor="field-blank">Allow Blank</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="field-null"
                            checked={selectedField.options.null || false}
                            onCheckedChange={(checked) => {
                              const index = fields.findIndex(f => f === selectedField);
                              handleFieldUpdate(index, {
                                ...selectedField,
                                options: {
                                  ...selectedField.options,
                                  null: checked === true
                                }
                              });
                            }}
                          />
                          <Label htmlFor="field-null">Allow Null</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500 p-4">
                    Select a field to edit its properties or add a new field
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowCode(prev => !prev)}>
            <Code className="h-4 w-4 mr-2" />
            {showCode ? 'Hide' : 'Show'} Code
          </Button>
          <Button onClick={handleSaveModel}>
            Generate Model
          </Button>
        </CardFooter>
      </Card>
      
      {showCode && (
        <CodeBlock 
          code={generateModelCode()} 
          language="python" 
          filename="models.py"
          className="mt-4" 
        />
      )}
    </div>
  );
};

export default InteractiveModelBuilder;
