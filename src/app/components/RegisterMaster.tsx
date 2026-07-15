import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, Upload, Save, Plus, X, Eye, GripVertical, FileUp, Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'address' | 'date' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

const defaultFormTemplates = [
  { id: 'template1', name: 'Basic Registration', fields: 3, description: 'Simple name, email, phone' },
  { id: 'template2', name: 'Detailed Profile', fields: 8, description: 'Complete user information' },
  { id: 'template3', name: 'Quick Sign-Up', fields: 2, description: 'Minimal registration' },
  { id: 'template4', name: 'Enterprise Registration', fields: 12, description: 'Full business profile' },
];

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email Input', icon: '📧' },
  { value: 'phone', label: 'Phone Input', icon: '📱' },
  { value: 'address', label: 'Address', icon: '📍' },
  { value: 'date', label: 'Date Picker', icon: '📅' },
  { value: 'select', label: 'Dropdown Select', icon: '▼' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
];

export default function RegisterMaster() {
  const [activeTab, setActiveTab] = useState('default');
  
  // Set Up Default
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [requireDPA, setRequireDPA] = useState(true);
  const [requirePDPA, setRequirePDPA] = useState(true);

  // Create Form
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your name' },
    { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'your@email.com' },
    { id: '3', type: 'phone', label: 'Phone Number', required: true, placeholder: '+66 XX XXX XXXX' },
  ]);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Import Conditions
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; type: string; size: string; progress: number }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveDefault = () => {
    toast.success('Default registration form settings saved successfully!');
  };

  const handleAddField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: type as FormField['type'],
      label: `New ${type} field`,
      required: false,
      placeholder: ''
    };
    setFormFields([...formFields, newField]);
    setShowFieldDialog(false);
    toast.success('Field added to form');
  };

  const handleRemoveField = (id: string) => {
    if (formFields.length <= 2) {
      toast.error('Form must have at least 2 fields');
      return;
    }
    setFormFields(formFields.filter(f => f.id !== id));
    toast.success('Field removed from form');
  };

  const handleSaveTemplate = () => {
    toast.success('Form template saved successfully!', {
      description: 'Template is now available for selection'
    });
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    const newFile = {
      id: Date.now().toString(),
      name: 'registration_conditions.pdf',
      type: 'PDF',
      size: '2.4 MB',
      progress: 0
    };
    
    setUploadedFiles([...uploadedFiles, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles(prev => prev.map(f => 
        f.id === newFile.id ? { ...f, progress } : f
      ));
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }
    }, 200);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
    toast.success('File removed');
  };

  const currentTemplate = defaultFormTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-gray-600">Customer App Configuration</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">Register Master</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6" />
          <h2 className="text-white">Register Master</h2>
        </div>
        <p className="text-blue-50">Configure registration forms, default settings, and import conditions</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="default">Set Up Default</TabsTrigger>
          <TabsTrigger value="create">Create Registration Form</TabsTrigger>
          <TabsTrigger value="import">Import Condition File</TabsTrigger>
        </TabsList>

        {/* Tab 1: Set Up Default */}
        <TabsContent value="default" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Default Registration Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Template Selection */}
                  <div className="space-y-3">
                    <Label>Select Default Form Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultFormTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-xs text-gray-500">{template.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentTemplate && (
                      <p className="text-sm text-gray-600">
                        {currentTemplate.fields} fields • {currentTemplate.description}
                      </p>
                    )}
                  </div>

                  {/* Consent Settings */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900">Consent Requirements</h3>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#007AFF] transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={requireDPA} 
                          onCheckedChange={(checked) => setRequireDPA(checked as boolean)}
                        />
                        <div>
                          <p className="text-gray-900">Require DPA Consent</p>
                          <p className="text-gray-500 text-sm">Users must agree to Data Processing Agreement</p>
                        </div>
                      </div>
                      <Badge variant={requireDPA ? "default" : "outline"}>
                        {requireDPA ? 'Required' : 'Optional'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#007AFF] transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={requirePDPA} 
                          onCheckedChange={(checked) => setRequirePDPA(checked as boolean)}
                        />
                        <div>
                          <p className="text-gray-900">Require PDPA Consent</p>
                          <p className="text-gray-500 text-sm">Users must agree to Personal Data Protection Act</p>
                        </div>
                      </div>
                      <Badge variant={requirePDPA ? "default" : "outline"}>
                        {requirePDPA ? 'Required' : 'Optional'}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveDefault} className="bg-[#007AFF] hover:bg-[#0051D5]">
                      <Save className="w-4 h-4 mr-2" />
                      Save Default Form
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardTitle>Form Preview</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <h3 className="text-gray-900 mb-4">Registration Form</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-sm text-gray-600">Full Name *</Label>
                        <div className="h-8 bg-white border rounded mt-1"></div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-sm text-gray-600">Email Address *</Label>
                        <div className="h-8 bg-white border rounded mt-1"></div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-sm text-gray-600">Phone Number *</Label>
                        <div className="h-8 bg-white border rounded mt-1"></div>
                      </div>
                      {requireDPA && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                          <Checkbox checked disabled className="mt-0.5" />
                          <span className="text-xs text-gray-700">I accept the Data Processing Agreement (DPA)</span>
                        </div>
                      )}
                      {requirePDPA && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                          <Checkbox checked disabled className="mt-0.5" />
                          <span className="text-xs text-gray-700">I accept the Personal Data Protection Act (PDPA)</span>
                        </div>
                      )}
                      <Button className="w-full bg-[#007AFF] text-white" disabled>
                        Submit Registration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Create Registration Form */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create Registration Form</CardTitle>
                  <p className="text-gray-500 text-sm mt-1">Drag & drop to reorder fields, click to edit</p>
                </div>
                <Button onClick={() => setShowFieldDialog(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    layout
                    className="flex items-center gap-3 p-4 border rounded-lg bg-white hover:shadow-md transition-all group"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Input
                          value={field.label}
                          onChange={(e) => {
                            setFormFields(formFields.map(f => 
                              f.id === field.id ? { ...f, label: e.target.value } : f
                            ));
                          }}
                          className="max-w-xs"
                        />
                        {field.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="text-xs text-gray-500">Type: {field.type}</Label>
                        <Label className="text-xs text-gray-400">Field #{index + 1}</Label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => {
                          setFormFields(formFields.map(f => 
                            f.id === field.id ? { ...f, required: checked as boolean } : f
                          ));
                        }}
                      />
                      <span className="text-sm text-gray-600">Required</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(field.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </motion.div>
                ))}

                {formFields.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No fields added yet</p>
                    <p className="text-sm mt-1">Click "Add Field" to start building your form</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t mt-6">
                <Button onClick={handleSaveTemplate} className="bg-[#007AFF] hover:bg-[#0051D5]">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button onClick={() => setShowPreview(true)} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Form
                </Button>
                <Button variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Import Condition File */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Condition File</CardTitle>
              <p className="text-gray-500 text-sm">Upload PDF or DOCX files containing registration conditions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#007AFF] transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
                onClick={handleFileUpload}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PDF or DOCX files (Max 10MB)</p>
                {isUploading && (
                  <div className="mt-4">
                    <p className="text-sm text-blue-600">Uploading...</p>
                  </div>
                )}
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-gray-900">Uploaded Files</h3>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-gray-900">{file.name}</p>
                            <p className="text-gray-500 text-sm">{file.type} • {file.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          disabled={file.progress < 100}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      
                      {file.progress < 100 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Uploading...</span>
                            <span>{file.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-[#007AFF] h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {file.progress === 100 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          ✓ Upload complete
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleFileUpload} className="bg-[#007AFF] hover:bg-[#0051D5]" disabled={isUploading}>
                  <FileUp className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Import Conditions'}
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Field Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Form Field</DialogTitle>
            <DialogDescription>Select the type of field to add to your registration form</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {fieldTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleAddField(type.value)}
                className="flex items-center gap-3 p-4 border rounded-lg hover:border-[#007AFF] hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <p className="text-gray-900">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.value}</p>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registration Form Preview</DialogTitle>
            <DialogDescription>This is how your form will appear to users</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'text' || field.type === 'email' || field.type === 'phone' ? (
                    <Input placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} type={field.type} />
                  ) : field.type === 'address' ? (
                    <Input placeholder="Enter your address" />
                  ) : field.type === 'date' ? (
                    <Input type="date" />
                  ) : field.type === 'select' ? (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">{field.label}</span>
                    </div>
                  ) : null}
                </div>
              ))}
              <Button className="w-full bg-[#007AFF]" disabled>Submit</Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
