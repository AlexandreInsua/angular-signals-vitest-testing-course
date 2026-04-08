import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoursesCardList } from '../courses-card-list/courses-card-list';
import { CourseCategory } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { TabsComponent } from '../tabs/tabs';
import { TabData } from '../tabs/tabs.model';

@Component({
  selector: 'courses',
  imports: [CoursesCardList, TabsComponent],
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss'],
})
export class Courses implements OnInit {
  private courseService = inject(CoursesService);

  // esta a pasar un signal
  allCourses = this.courseService.allCourses;
  activeTab = signal<CourseCategory>('beginner');

  courseTabs: TabData[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Advanced', value: 'advanced' },
  ];

  beginnerCourses = computed(() => this.allCourses().filter((c) => c.category === 'BEGINNER'));

  advancedCourses = computed(() => this.allCourses().filter((c) => c.category === 'ADVANCED'));

  ngOnInit(): void {
    this.reloadCourses();
  }

  async reloadCourses() {
    this.courseService.findAllCourses();
  }

  onTabChanged(newTab: CourseCategory) {
    this.activeTab.set(newTab);
  }
}
