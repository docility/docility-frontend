<template>
  <div class="supplier-component ">
    
    <div class="relative shadow-md sm:rounded-lg">
      <div class="pb-4 bg-white flex p-2 justify-between flex-row-reverse">
        <button @click="addNewSupplier()" class="bg-primary text-text-primary hover:bg-secondary-alternate hover:text-secondary-text py-2 px-4 rounded">Add Supplier</button>  
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input v-model="searchQuery" type="text" id="table-search" onchange="computed" class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search for items">
          </div>
      </div>
      
      <!-- Scrollable container with fixed header -->
      <div class="max-h-[700px] overflow-y-auto w-full">
          <table class="min-w-full text-sm text-left rtl:text-right text-primary dark:text-gray-400">
              <thead class="text-xs  uppercase  text-text-primary">
                  <tr class="sticky z-10">
                      <th scope="col" class="sticky top-0 p-4 bg-primary  z-10">
                          <div class="flex items-center">
                              <input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                              <label for="checkbox-all-search" class="sr-only">checkbox</label>
                          </div>
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3 z-10 bg-primary">
                          Supplier Id
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3 z-10 bg-primary">
                          Supplier Name
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3   z-10 bg-primary">
                          Supplier Purpose
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3   z-10 bg-primary">
                          Supplier Type
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3  z-10 bg-primary">
                          Glocal
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3  z-10 bg-primary">
                          Country
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3  z-10 bg-primary">
                          Assessment Status
                      </th>
                      <th scope="col" class="sticky top-0 px-6 py-3   z-10 bg-primary">
                          Actions
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="bg-background border-b hover:bg-secondary-alternate text-text-primary">
                      <td class="w-4 p-4">
                          <div class="flex items-center">
                              <input :id="'checkbox-table-' + supplier.id" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                              <label :for="'checkbox-table-' + supplier.id" class="sr-only">checkbox</label>
                          </div>
                      </td>
                      <td class="px-6 py-4">{{ supplier.attributes?.supplier_id }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.supplier_name }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.supplier_purpose }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.supplier_type }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.glocal }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.country }}</td>
                      <td class="px-6 py-4">{{ supplier.attributes?.assessment_status }}</td>
                      <td class="px-6 py-4 gap-2 flex sticky top-0 ">
                          <button @click="editSupplier(supplier)" class="text-blue-600 hover:underline">Edit</button>
                          <button @click="deleteSupplier(supplier.id)" class="text-red-600 hover:underline">Delete</button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
  
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <span @click="showModal = false" class="close">&times;</span> 
          <h1 class="text-2xl font-bold mb-4"> {{ updateData == true ? "Update":"New" }} Supplier</h1>
    
          <form class="h-[80%]" @submit.prevent="handleSubmit">
            <div class="overflow-auto h-full p-3">
              <h2 class="text-lg font-semibold mt-6  mb-2">Supplier Details</h2>
              <div class="grid grid-cols-4 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Supplier ID:</label>
                  <input type="text" v-model="createSupplier.supplierId" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Supplier Name:</label>
                  <input type="text" v-model="createSupplier.supplierName" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Supplier Trading As:</label>
                  <input type="text" v-model="createSupplier.supplierTradingAs" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">ABN No.:</label>
                  <input type="text" v-model="createSupplier.abn" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">ACN No.:</label>
                  <input type="text" v-model="createSupplier.acn" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Website:</label>
                  <input type="url" v-model="createSupplier.website" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Supplier Address:</label>
                  <input type="text" v-model="createSupplier.supplierAddress" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Country:</label>
                  <input type="text" v-model="createSupplier.country" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">State:</label>
                  <input type="text" v-model="createSupplier.state" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Suburb:</label>
                  <input type="text" v-model="createSupplier.suburb" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Postcode:</label>
                  <input type="text" v-model="createSupplier.postcode" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Contact Person Name:</label>
                  <input type="text" v-model="createSupplier.contactPersonName" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Phone Number:</label>
                  <input type="tel" v-model="createSupplier.phoneNumber" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Email ID:</label>
                  <input type="email" v-model="createSupplier.emailId" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">24x7 Contact Person Name:</label>
                  <input type="text" v-model="createSupplier.contactPerson24x7" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">24x7 Phone Number:</label>
                  <input type="tel" v-model="createSupplier.phoneNumber24x7" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
    
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">24x7 Email ID:</label>
                  <input type="email" v-model="createSupplier.emailId24x7" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Local / Overseas Supplier:</label>
              <select v-model="createSupplier.supplierLocation" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                <option value="local">Local</option>
                <option value="international">International</option>
              </select>
            </div>

           

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Payment Terms:</label>
              <input type="text" v-model="createSupplier.paymentTerms" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
            </div> 

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Supplier Category:</label>
              <select v-model="createSupplier.supplierCategory" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                <option value="critical">Critical Supplier</option>
                <option value="non-critical">Non-Critical Supplier</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Supplier Type:</label>
              <select v-model="createSupplier.supplierType" @change="checkSupplierType" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                <option value="cloud">Cloud Service Provider</option>
                <option value="managed">Managed Service Provider</option>
                <option value="hr">Human Resource Provider</option>
                <option value="third-party">Third Party Service Provider</option>
                <option value="office">Office Supplier</option>
                <option value="misc">Misc Supplier</option>
              </select> 
                
            </div> 
            <!-- <h3 v-if="createSupplier.supplierType === 'cloud'" class="text-lg font-semibold">Cloud Service Provider Terms and Conditions</h3> -->
            <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Terms for Use:</label>
              <input v-model="createSupplier.termsForUse" class="mt-1 block w-full p-2 border border-gray-300 rounded"/>
            </div>
            <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Ongoing Management:</label> 
              <input v-model="createSupplier.ongoingManagement" class="mt-1 block w-full p-2 border border-gray-300 rounded"/>
            </div>
            <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Exit Terms:</label>
              <input v-model="createSupplier.exitTerms" class="mt-1 block w-full p-2 border border-gray-300 rounded"/>
            </div> 
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Data Shared with Supplier:</label>
                <select v-model="createSupplier.dataShared" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="PII">PII</option>
                  <option value="customer-info">Customer Information</option>
                  <option value="company-info">Company Information</option>
                  <option value="no-info">No Information Shared</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Department Managing Supplier:</label>
                <input type="text" v-model="createSupplier.managingDepartment" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Owner:</label>
                <input type="text" v-model="createSupplier.supplierOwner" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">SLA Applicable:</label>
                <select v-model="createSupplier.slaApplicable" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div v-if="['cloud', 'managed'].includes(createSupplier.supplierType)" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">SLA Details:</label>
                <input type="file" @change="handleFileUpload" class=" block w-full  border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Credit Limit:</label>
                <input type="number" v-model="createSupplier.creditLimit" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700">Special Conditions / Additional Notes:</label>
                <input v-model="createSupplier.specialConditions" class="mt-1 block w-full p-2 border border-gray-300 rounded"   />
              </div>

              </div>

            <h2 class="text-lg font-semibold mt-6  mb-2">Bank Details</h2>
              <div class="grid grid-cols-3 gap-4">
                <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">BSB:</label>
                <input type="text" v-model="createSupplier.bsb" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Account No.:</label>
                <input type="text" v-model="createSupplier.accountNo" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Account Name:</label>
                <input type="text" v-model="createSupplier.accountName" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <h2 class="text-lg font-semibold mt-6 mb-2">Certification</h2>
            <div class="grid grid-cols-3 gap-3">

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 27001 Certified and Valid:</label>
                <select v-model="createSupplier.iso27001" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.iso27001 == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 9001 Certified and Valid:</label>
                <select v-model="createSupplier.iso9001" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.iso9001 == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 14001 Certified and Valid:</label>
                <select v-model="createSupplier.iso14001" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.iso14001 == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 45001 Certified and Valid:</label>
                <select v-model="createSupplier.iso45001" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.iso45001 == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Modern Slavery Act Applicable:</label>
                <select v-model="createSupplier.modernSlaveryAct" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input  v-if="createSupplier.modernSlaveryAct == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
  
              
  
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Estimated Annual Budget Value:</label>
                <input type="number" v-model="createSupplier.annualBudget" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
  
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contract Commencement Date:</label>
                <input type="date" v-model="createSupplier.contractStartDate" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
  
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contract End Date:</label>
                <input type="date" v-model="createSupplier.contractEndDate" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div></div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Modern Slavery Published Date:</label>
                <input type="date" v-model="createSupplier.modernSlaveryDate" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <input type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
  
              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700">Any Other Certification:</label>

                <input type="text" v-model="createSupplier.otherCertification" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <div class="flex">
                  <div class="flex flex-row">
                  <select v-model="createSupplier.otherCertificationExists" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                    <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                      {{ boolean.text }}
                    </option>
                  </select>
                  <input v-if="createSupplier.otherCertificationExists == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
            
            <h2 class="text-lg font-semibold mt-6 mb-2">Assessment</h2>
            <div class="grid grid-cols-3 gap-3">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Sensitivity of Data Involved (CIA Impact):</label>
                <select v-model="createSupplier.sensitivityData" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="confidentiality">Confidentiality</option>
                  <option value="integrity">Integrity</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Threat:</label>
                <input type="text" v-model="createSupplier.threat" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Matrix to be Used for Risk Assessment:</label>
                <select v-model="createSupplier.riskMatrix" @change="updateLikelihoodImpact" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="3x3">3x3</option>
                  <option value="5x5">5x5</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Likelihood:</label>
                <select v-model="createSupplier.selectedLikelihoodOptions" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="option in likelihoodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>  

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Impact:</label>
                <select v-model="createSupplier.selectedImpactOptions" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="option in impactOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Inherent Risk Level/Rating:</label>
                <input type="text" :value="calculateRiskLevel()" readonly class="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Risk Assessment Completed:</label>
                <select v-model="createSupplier.riskAssessmentCompleted" class="mt-1 block w-full p-2 border border-gray-300 rounded"> 
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Required:</label>
                <select v-model="createSupplier.supplierAssessmentRequired" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Due Date:</label>
                <input type="date" v-model="createSupplier.supplierAssessmentDueDate" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Status:</label>
                <select v-model="createSupplier.supplierAssessmentStatus" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="not-due">Not Due</option>
                  <option value="not-started">Not Yet Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Reviewer Person:</label>
                <input type="text" v-model="createSupplier.supplierReviewer" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Agreement:</label>
                <select v-model="createSupplier.supplierAgreement" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.supplierAgreement == 1" type="file" @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Approval Status:</label>
                <select v-model="createSupplier.approvalStatus" class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Date Entered:</label>
                <input type="date" v-model="createSupplier.dateEntered" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Decision Date:</label>
                <input type="date" v-model="createSupplier.decisionDate" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
          </div>
          <div> 
            <button type="submit" class="w-full mt-4 bg-primary text-secondary-text font-semibold py-2 rounded hover:bg-secondary-alternate">Submit</button>
            <button v-on:click="closeModals()" class="w-full mt-4 bg-secondary text-primary-text font-semibold py-2 rounded hover:bg-secondary-alternate">Cancel</button>
          </div>
          </form> 
      </div>
    </div> 
  </div>
  
</template>

<script>

import http from '@/helpers/http';
import { toast } from 'vue3-toastify';
 
export default { 
  name: "SupplierComponent",
  data() {
    return { 
      showModal: false,
      searchQuery: '',
      updateData: false,
      supplierList: [],
      selectedSupplierId: null,
      createSupplier: {
        supplierId: '',  
        supplierName: '',
        supplierTradingAs: '',
        abn: '',
        acn: '',
        website: '',
        bsb: '',
        accountNo: '',
        accountName: '',
        supplierLocation: 'local',
        supplierAddress: '',
        country: '',
        state: '',
        suburb: '',
        postcode: '',
        contactPersonName: '',
        phoneNumber: '',
        emailId: '',
        contactPerson24x7: '',
        phoneNumber24x7: '',
        emailId24x7: '',
        paymentTerms: '',
        specialConditions: '',
        supplierCategory: '',
        supplierType: '',
        termsForUse: '',
        ongoingManagement: '',
        exitTerms: '',
        dataShared: '',
        managingDepartment: '',
        supplierOwner: '',
        slaApplicable: '0',
        creditLimit: null,
        iso27001: '0',
        iso9001: '0',
        iso14001: '0',
        iso45001: '0',
        modernSlaveryAct: '0',
        modernSlaveryDate: '',
        otherCertification: '',
        otherCertificationExists: '0',
        annualBudget: null,
        contractStartDate: '',
        contractEndDate: '',
        sensitivityData: '',
        threat: '',
        riskMatrix: '3x3',
        inherent_risk_level: '',
        riskAssessmentCompleted: '0',
        supplierAssessmentRequired: '0',
        supplierAssessmentDueDate: '',
        supplierAssessmentStatus: 'not-due',
        supplierReviewer: '',
        supplierAgreement: '0',
        approvalStatus: 'draft',
        dateEntered: '',
        decisionDate: '',
        selectedLikelihoodOptions: 0,
        selectedImpactOptions: 0,
      },

      likelihoodOptions: [],
      booleanSelect: [
        {"value": "1", "text": "YES"}, 
        {"value": "0", "text": "NO"}
      ],
      impactOptions: [],
    };
  },
  methods: {
    addNewSupplier() {
        this.showModal = true,
        this.resetData()
    },
    closeModals() {
      this.resetData()
      this.showModal = false
    },
    resetData() {
      this.selectedSupplierId = null,
      this.updateData = false
      this.createSupplier = {
        supplierId: '',  
        supplierName: '',
        supplierTradingAs: '',
        abn: '',
        acn: '',
        website: '',
        bsb: '',
        accountNo: '',
        accountName: '',
        supplierLocation: 'local',
        supplierAddress: '',
        country: '',
        state: '',
        suburb: '',
        postcode: '',
        contactPersonName: '',
        phoneNumber: '',
        emailId: '',
        contactPerson24x7: '',
        phoneNumber24x7: '',
        emailId24x7: '',
        paymentTerms: '',
        specialConditions: '',
        supplierCategory: '',
        supplierType: '',
        termsForUse: '',
        ongoingManagement: '',
        exitTerms: '',
        dataShared: '',
        managingDepartment: '',
        supplierOwner: '',
        slaApplicable: '0',
        creditLimit: null,
        iso27001: '0',
        iso9001: '0',
        iso14001: '0',
        iso45001: '0',
        modernSlaveryAct: '0',
        modernSlaveryDate: '',
        otherCertification: '',
        otherCertificationExists: '0',
        annualBudget: null,
        contractStartDate: '',
        contractEndDate: '',
        sensitivityData: '',
        threat: '',
        riskMatrix: '3x3',
        inherent_risk_level: '',
        riskAssessmentCompleted: '0',
        supplierAssessmentRequired: '0',
        supplierAssessmentDueDate: '',
        supplierAssessmentStatus: 'not-due',
        supplierReviewer: '',
        supplierAgreement: '0',
        approvalStatus: 'draft',
        dateEntered: '',
        decisionDate: '',
        selectedLikelihoodOptions: 0,
        selectedImpactOptions: 0,
      }
    },
    async handleSubmit() {
      // Submit logic here
      console.log('Form submitted:', this.createSupplier);

      const payload = {
        "supplier_id": String(this.createSupplier.supplierId),
        "supplier_name": String(this.createSupplier.supplierName),
        "trading_as": String(this.createSupplier.supplierTradingAs),
        "abn_no": String(this.createSupplier.abn),
        "acn_no": String(this.createSupplier.acn),
        "website": String(this.createSupplier.website),
        "bsb": String(this.createSupplier.bsb),
        "bank_acc_no": String(this.createSupplier.accountNo),
        "bank_acc_name": String(this.createSupplier.accountName),
        "glocal": String(this.createSupplier.supplierLocation),
        "supplier_type": String(this.createSupplier.supplierType),
        "address": String(this.createSupplier.supplierAddress),
        "country": String(this.createSupplier.country),
        "state": String(this.createSupplier.state),
        "suburb": String(this.createSupplier.suburb),
        "postal_code": String(this.createSupplier.postcode),
        "contact_person_name": String(this.createSupplier.contactPersonName),
        "contact_person_number": String(this.createSupplier.phoneNumber),
        "contact_person_email": String(this.createSupplier.emailId),
        "support_person_name": String(this.createSupplier.contactPerson24x7),
        "support_person_number": String(this.createSupplier.phoneNumber24x7),
        "support_person_email": String(this.createSupplier.emailId24x7),
        "payment_terms": String(this.createSupplier.paymentTerms),
        "notes": String(this.createSupplier.specialConditions),
        "supplier_category": String(this.createSupplier.supplierCategory),
        'terms_for_use': String(this.createSupplier.termsForUse),
        'ongoing_management': String(this.createSupplier.ongoingManagement),
        'exit_terms': String(this.createSupplier.exitTerms),
        "supplier_purpose": '',
        "service_provider": String(this.createSupplier.supplierType),
        "data_shared": String(this.createSupplier.dataShared),
        "department_managing": String(this.createSupplier.managingDepartment),
        "owner": String(this.createSupplier.supplierOwner),
        "is_sla": String(this.createSupplier.slaApplicable),
        "sla_details": "",
        "credit_limit": String(this.createSupplier.creditLimit),
        "iso_27001": String(this.createSupplier.iso27001),
        "iso_9001": String(this.createSupplier.iso9001),
        "iso_14001": String(this.createSupplier.iso14001),
        "iso_45001": String(this.createSupplier.iso45001),
        "modern_slavery_act": String(this.createSupplier.modernSlaveryAct),
        "modern_slavery_statement_date": String(this.createSupplier.modernSlaveryDate),
        "certification": String(this.createSupplier.otherCertification),
        "other_Certification_exists": String(this.createSupplier.otherCertificationExists),
        "annual_budget": String(this.createSupplier.annualBudget),
        "contract_commencement_date": String(this.createSupplier.contractStartDate),
        "contract_end_date": String(this.createSupplier.contractEndDate),
        "cia_impact": String(this.createSupplier.sensitivityData),
        "threat": String(this.createSupplier.threat),
        "matrix": String(this.createSupplier.riskMatrix),
        "likelihood": String(this.createSupplier.selectedLikelihoodOptions),
        "impact": String(this.createSupplier.selectedImpactOptions),
        "inherent_risk_level": String(this.calculateRiskLevel()),
        "risk_assessment_completed": String(this.createSupplier.riskAssessmentCompleted),
        "risk_assessment_required": String(this.createSupplier.supplierAssessmentRequired),
        "assessment_due_date": String(this.createSupplier.supplierAssessmentDueDate),
        "assessment_status": String(this.createSupplier.supplierAssessmentStatus),
        "assessment_reviewer_person": String(this.createSupplier.supplierReviewer),
        "supplier_agreement": String(this.createSupplier.supplierAgreement),
        "approval_status": String(this.createSupplier.approvalStatus),
        "date_entered": String(this.createSupplier.dateEntered),
        "decision_date": String(this.createSupplier.decisionDate)
      }   
      try {
        if (this.updateData) {
          await http.put(`api/suppliers/${this.selectedSupplierId}`, { data: payload }); 
          toast.success("Supplier Details Updated")
        } else { 
          await http.post("api/suppliers", { data: payload }); 
          toast.success("New Supplier Added")
        }
        this.fetchSupplier()
      } catch(error) {
        console.log(error)
        toast.error("Error Adding Supplier:"+ toast.error(error.response.data.error.message))
      }
    },
    async editSupplier(supplierData) {
      this.showModal = true
      this.updateData = true
      this.selectedSupplierId = supplierData.id
      const supplier = supplierData.attributes
      this.createSupplier = {
        "supplierId": String(supplier.supplier_id),
        "supplierName": String(supplier.supplier_name),
        "supplierTradingAs": String(supplier.trading_as),
        "abn": String(supplier.abn_no),
        "acn": String(supplier.acn_no),
        "website": String(supplier.website),
        "bsb": String(supplier.bsb),
        "accountNo": String(supplier.bank_acc_no),
        "accountName": String(supplier.bank_acc_name),
        "supplierLocation": String(supplier.glocal), 
        "supplierAddress": String(supplier.address),
        "country": String(supplier.country),
        "state": String(supplier.state),
        "suburb": String(supplier.suburb),
        "postcode": String(supplier.postal_code),
        "contactPersonName": String(supplier.contact_person_name),
        "phoneNumber": String(supplier.contact_person_number),
        "emailId": String(supplier.contact_person_email),
        "contactPerson24x7": String(supplier.support_person_name),
        "phoneNumber24x7": String(supplier.support_person_number),
        "emailId24x7": String(supplier.support_person_email),
        "paymentTerms": String(supplier.payment_terms),
        "specialConditions": String(supplier.notes),
        "supplierCategory": String(supplier.supplier_category),
        'termsForUse': String(supplier.terms_for_use),
        'ongoingManagement': String(supplier.ongoing_management),
        'exitTerms': String(supplier.exit_terms),
        "supplier_purpose": String(supplier.supplier_purpose),
        "supplierType": String(supplier.service_provider),
        "dataShared": String(supplier.data_shared),
        "managingDepartment": String(supplier.department_managing),
        "supplierOwner": String(supplier.owner),
        "slaApplicable": String(supplier.is_sla),
        "sla_details": String(supplier.sla_details),
        "creditLimit": String(supplier.credit_limit),
        "iso27001": String(supplier.iso_27001),
        "iso9001": String(supplier.iso_9001),
        "iso14001": String(supplier.iso_14001),
        "iso45001": String(supplier.iso_45001),
        "modernSlaveryAct": String(supplier.modern_slavery_act),
        "modernSlaveryDate": String(supplier.modern_slavery_statement_date),
        "otherCertification": String(supplier.certification),
        "otherCertificationExists": String(supplier.other_Certification_exists),
        "annualBudget": String(supplier.annual_budget),
        "contractStartDate": String(supplier.contract_commencement_date),
        "contractEndDate": String(supplier.contract_end_date),
        "sensitivityData": String(supplier.cia_impact),
        "threat": String(supplier.threat),
        "riskMatrix": String(supplier.matrix),
        "selectedLikelihoodOptions": String(supplier.likelihood),
        "selectedImpactOptions": String(supplier.impact),
        "inherent_risk_level": String(this.calculateRiskLevel()),
        "riskAssessmentCompleted": String(supplier.risk_assessment_completed),
        "supplierAssessmentRequired": String(supplier.risk_assessment_required),
        "supplierAssessmentDueDate": String(supplier.assessment_due_date),
        "supplierAssessmentStatus": String(supplier.assessment_status),
        "supplierReviewer": String(supplier.assessment_reviewer_person),
        "supplierAgreement": String(supplier.supplier_agreement),
        "approvalStatus": String(supplier.approval_status),
        "dateEntered": String(supplier.date_entered),
        "decisionDate": String(supplier.decision_date),
      }
    },
    handleFileUpload(event) {
      // Handle file upload logic here
      console.log('File uploaded:', event.target.files);
    },
    checkSupplierType() {
      // Automatically populate SLA applicable based on supplier type
      if (this.createSupplier.supplierType === 'cloud' || this.createSupplier.supplierType === 'managed') {
        this.createSupplier.slaApplicable = 'yes';
      } else {
        this.createSupplier.slaApplicable = 'no';
      }
      this.updateLikelihoodImpact();
    },
    updateLikelihoodImpact() {
      // Update options based on selected matrix
      if (this.createSupplier.riskMatrix === '3x3') {
        this.likelihoodOptions = [
          { value: 3, text: 'Almost Certain' },
          { value: 2, text: 'Possible' },
          { value: 1, text: 'Rare' },
        ];
        this.impactOptions = [
          { value: 3, text: 'Significant' },
          { value: 2, text: 'Moderate' },
          { value: 1, text: 'Insignificant' },
        ];
      } else {
        this.likelihoodOptions = [
          { value: 5, text: 'Almost Certain' },
          { value: 4, text: 'Likely' },
          { value: 3, text: 'Possible' },
          { value: 2, text: 'Unlikely' },
          { value: 1, text: 'Rare' },
        ];
        this.impactOptions = [
          { value: 5, text: 'Severe' },
          { value: 4, text: 'Major' },
          { value: 3, text: 'Moderate' },
          { value: 2, text: 'Minor' },
          { value: 1, text: 'Insignificant' },
        ];
      }
    },
    calculateRiskLevel() {
      const likelihoodValue = parseInt(this.createSupplier.selectedLikelihoodOptions);
      const impactValue = parseInt(this.createSupplier.selectedImpactOptions);
      const riskLevel = likelihoodValue + impactValue;

      if (riskLevel <= 3) return 'Low';
      else if (riskLevel <= 6) return 'Medium';
      else if (riskLevel <= 9) return 'High';
      return 'Extreme';
    },
    async fetchSupplier() {
      const suppliers = await http.get("api/suppliers", "")
      console.log(suppliers)
      this.supplierList = suppliers.data
    },
    async deleteSupplier(id) {
      try {
        const suppliers = await http.delete(`api/suppliers/${id}`)
        console.log(suppliers)
        this.supplierList = suppliers.data
        toast.success("Supplier Successfully Deleted")
        this.fetchSupplier()
      } catch ( error ) {
        toast.error("Error Deleting Supplier:"+ toast.error(error.response.data.error.message))
      } 
    }
  },
  created() {
    this.updateLikelihoodImpact();
    this.fetchSupplier();
  }, 
  computed: {
    filteredSuppliers() {
      console.log("filtere", this.supplierList.data) 
      try {
        return this.supplierList.data.filter((supplier) => {
          return (
            supplier.attributes?.supplier_name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            supplier.attributes?.supplier_purpose
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            supplier.attributes?.country
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
          );
        });
      } catch (error) {
        return null
      }
   
    },
  },
};
</script>

<style scoped>
.supplier-component {
  max-width: 100%;  
  width: 100%;
  text-align: start;
  overflow: hidden;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 100%;
  height:90%; 
  max-width: 1000px;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}
.input-field {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
}
</style>
