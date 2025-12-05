import { FunctionCode } from '@app/shared/enums/enums-constant';
import {
  PinIndexComponent
} from '@app/modules/hrm/pages/staff-info/personal-information/pin-index/pin-index.component';
import {
  EducationInformationComponent
} from '@app/modules/hrm/pages/staff-info/education-information/ein-index/education-information.component';
import {
  AwardInformationComponent
} from '@app/modules/hrm/pages/staff-info/award-information/ain-index/award-information.component';
import {
  FrsIndexComponent
} from '@app/modules/hrm/pages/staff-info/family-relationships/frs-index/frs-index.component';
import { WinComponent } from '@app/modules/hrm/pages/staff-info/work-information/win-index/win.component';
import { PioIndexComponent } from '@app/modules/hrm/pages/staff-info/policy-info/pio-index/pio-index.component';
import { PioFormComponent } from '@app/modules/hrm/pages/staff-info/policy-info/pio-form/pio-form.component';
import { BasicFormComponent } from '@app/modules/hrm/pages/staff-research/basic/basic-form/basic-form.component';

export const PANELS_INFORMATION: any[] = [
  {
    id: 'staff_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/personal-info.svg',
    code: FunctionCode.HR_PERSONAL_INFO,
    name: 'hrm.panel.personalInformation',
    panelComponent: PinIndexComponent,
    extraMode: [
      {
        type: 'EDIT_MODAL',
        contentHeader: 'hrm.staffManager.label.basicInfo',
        content: BasicFormComponent
      }
    ]
  },
  {
    id: 'family_relationship_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.HR_FAMILY_RELATIONSHIP,
    name: 'hrm.panel.familyRelationships',
    panelComponent: FrsIndexComponent,
  },
  {
    id: 'education_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.HR_EDUCATION_PROCESS,
    name: 'hrm.panel.educationInformation',
    panelComponent: EducationInformationComponent
  },
  {
    id: 'work_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.HR_WORK_PROCESS,
    name: 'hrm.panel.workInformation',
    panelComponent: WinComponent,
  },
  {
    id: 'award_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.HR_AWARD_PROCESS,
    name: 'hrm.panel.rewardHisInformation',
    panelComponent: AwardInformationComponent,
  },
  {
    id: 'policy_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.HR_POLITICAL_INFO,
    name: 'hrm.panel.policyInformation',
    panelComponent: PioIndexComponent,
    extraMode: [
      {
        type: 'EDIT_MODAL',
        content: PioFormComponent,
        contentHeader: 'hrm.staffManager.panel.policyInformation'
      }
    ]
  }
];

export const SCROLL_TABS_DATA = [
  {
    title: 'hrm.tab.personalInformation',
    code: FunctionCode.HR_PERSONAL_INFO,
    scrollTo: 'staff_information'
  },
  {
    title: 'hrm.panel.educationInformation',
    code: FunctionCode.HR_EDUCATION_PROCESS,
    scrollTo: 'education_information'
  },
  {
    title: 'hrm.panel.workInformation',
    code: FunctionCode.HR_WORK_PROCESS,
    scrollTo: 'work_information'
  },
  {
    title: 'hrm.panel.rewardHisInformation',
    code: FunctionCode.HR_AWARD_PROCESS,
    scrollTo: 'award_information'
  }
];

