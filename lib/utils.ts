import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sampleJobDescription = `
### Job Title: Full Stack Developer

#### Location: Jhumri Talaiya
#### Employment Type: Full-time
#### Department: Technology
#### Reports To: Lead Developer/CTO

### About Us:
At CMailer, we are at the forefront of innovation, creating cutting-edge solutions that drive the industry forward. Our team is composed of talented and passionate professionals dedicated to building software that makes a difference. We believe in fostering a collaborative environment where creativity and innovation thrive.

### Job Overview:
We are seeking a highly skilled Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience in both front-end and back-end development, with a passion for building scalable and efficient applications. You will be responsible for developing and maintaining our web applications, ensuring high performance and responsiveness to requests from the front-end.

### Key Responsibilities:
- **Design and Develop**: Create and implement front-end and back-end components and services.
- **Collaborate**: Work closely with product managers, designers, and other developers to understand requirements and translate them into technical solutions.
- **Maintain Code Quality**: Write clean, maintainable, and efficient code; conduct code reviews and provide constructive feedback to peers.
- **Optimize**: Ensure the performance, quality, and responsiveness of applications; identify and fix bottlenecks and bugs.
- **Stay Updated**: Keep abreast of the latest industry trends and technologies to ensure our tech stack remains cutting-edge.
- **Documentation**: Create and maintain comprehensive documentation for new and existing features.

### Required Qualifications:
- **Education**: Bachelor’s degree in Computer Science, Information Technology, or a related field.
- **Experience**: 
  - 1+ years of experience in full stack development.
  - Proficiency in front-end technologies such as HTML, CSS, JavaScript (React, Angular, or Vue.js).
  - Strong knowledge of server-side languages such as Node.js, Python, Ruby, or Java.
  - Experience with database technologies like MySQL, PostgreSQL, or MongoDB.
- **Skills**:
  - Proficient understanding of code versioning tools, such as Git.
  - Experience with RESTful APIs and web services.
  - Strong problem-solving skills and attention to detail.
  - Excellent communication and teamwork skills.
  - Familiarity with containerization and orchestration tools like Docker and Kubernetes is a plus.

### Preferred Qualifications:
- Experience with cloud platforms (AWS, Azure, Google Cloud).
- Familiarity with DevOps practices and CI/CD pipelines.
`;

