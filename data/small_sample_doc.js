var sampleDoc = {
  "id": "9cc2e4def8b39bc234bf5e186bafa743",
  "schema": [
    "archivist-interview",
    "0.2.0"
  ],
  "nodes": {
    "document": {
      "id": "document",
      "type": "document",
      "containers": [
        "content"
      ],
      // General stuff
      "guid": "9cc2e4def8b39bc234bf5e186bafa743",
      "creator": "",
      "title": "Test document",
      "abstract": "Russian abstract",
      "abstract_en": "Enter english abstract here",
      "created_at": "2015-03-04T10:56:18.229Z",
      "updated_at": "2015-03-04T10:56:47.425Z",
      "published_on": "2015-03-04",

      // Project related
      "project_name": "Internationales Sklaven-und Zwangsarbeiter Befragungsprojekt",
      "project_location": "54ef1331afda2d3c024e4817",
      "conductor": "Irina Ostrovskaya",
      "operator": "Eduard Kechedjiyan",
      "sound_operator": "Eduard Kechedjiyan",
      "record_type": "video",
      "media_id": "",
      "interview_location": "respondent's apartment",
      "interview_date": "2005-07-16",
      "persons_present": "Nikolay Bogoslavec, Irina Ostrovskaya, Eduard Kechedjiyan, Alexey Bogoslavec",
      "interview_duration": "247",

      // Interview subject related
      "interviewee_bio": "Please enter interview subject bio.",
      "interviewee_category": "Ost-Arbeiter, concentration camp prisoner",
      "interviewee_prisons": ["54ef1331afda2d3c024e4817", "54ef1331afda2d3c024e4818"],
      "interviewee_forced_labor_type": "intracamp work, earthworks (construction of barracks), digging tunnels for military factories",
      "interviewee_waypoints": ["waypoint_1", "waypoint_2"],

      // Workflow
      "transcripted": false,
      "verified": false,
      "finished": false
    },
    "waypoint_1": {
      "id": "waypoint_1",
      "type": "waypoint",
      "entityId": "54ef1331afda2d3c024e4817",
      "density": 4
    },
    "waypoint_2": {
      "id": "waypoint_2",
      "type": "waypoint",
      "entityId": "54ef1331afda2d3c024e4817",
      "density": 2
    },

    "content": {
      "type": "container",
      "id": "content",
      "nodes": [
        "text_1",
        "text_2",
        "text_3",
        "text_4",
        "text_5"
      ]
    },
    "text_1": {
      "type": "text",
      "id": "text_1",
      "content": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis scelerisque ligula. Proin tristique ligula id magna finibus rhoncus. Quisque dictum viverra sapien, vel elementum metus condimentum nec. Donec ac tellus nunc. Nullam fermentum pharetra justo, accumsan tristique quam tempus a. Quisque vitae luctus velit. Praesent lacinia enim ex, sed pulvinar neque dictum ultricies. Sed est metus, bibendum sed suscipit ut, cursus ut mi. Pellentesque sagittis mi nisi, eu blandit metus congue id. Pellentesque eget magna porta, rutrum odio et, commodo lacus. Sed vitae vehicula ante. Quisque suscipit iaculis est, vitae aliquet lacus dictum ut. Nulla enim dolor, pulvinar at odio vitae, sollicitudin eleifend ex. Maecenas eget ligula eget sem efficitur consectetur nec vel sem. In massa mauris, consequat vitae enim eget, vehicula aliquet turpis.'
    },

    "text_2": {
      "type": "text",
      "id": "text_2",
      "content": 'Proin in luctus sapien, ultrices commodo augue. Phasellus ultrices commodo augue, in blandit nibh euismod nibh vitae erat luctus ac. Aliquam euismod nibh vitae erat pulvinar, at semper libero tincidunt. Nulla finibus est ac consequat consequat. Sed at condimentum purus. Aliquam vulputate ipsum ut justo posuere, quis varius risus finibus. Ut scelerisque laoreet vehicula. Nullam gravida fringilla justo, nec efficitur nunc sagittis et. Suspendisse nibh ligula, imperdiet id interdum et, sollicitudin non mauris. Suspendisse potenti. Suspendisse luctus iaculis nulla sed efficitur. Nullam sed viverra metus. Etiam dictum blandit enim tincidunt maximus. Nullam tempus nibh at varius interdum.'
    },

    "entity_reference_1": {
      "id": "entity_reference_1",
      "type": "entity_reference",
      "path": [
        "text_2",
        "content"
      ],
      "target": "54ef1331afda2d3c024e4817", // this is an external object
      "startOffset": 24,
      "endOffset": 47
    },

    "entity_reference_2": {
      "id": "entity_reference_2",
      "type": "entity_reference",
      "path": [
        "text_1",
        "content"
      ],
      "target": "54f476ba973cfcef0354adab", // this is an external object
      "startOffset": 40,
      "endOffset": 70
    },

    "subject_reference_1": {
      "id": "subject_reference_1",
      "type": "subject_reference",
      "container": "content",
      "startPath": ["text_2", "content"],
      "startOffset": 10,
      "endPath": ["text_4", "content"],
      "endOffset": 40,
      "target": ["54bae99ca868bc3ec7fb5ad8"]
    },

    "subject_reference_2": {
      "id": "subject_reference_2",
      "type": "subject_reference",
      "container": "content",
      "startPath": ["text_1", "content"],
      "startOffset": 100,
      "endPath": ["text_2", "content"],
      "endOffset": 200,
      "target": ["54bae4cda868bc6fab4bcd0e", "54bae99ca868bc3ec7fb5ad8"]
    },

    // "remark_1": {
    //   "id": "remark_1",
    //   "type": "remark",
    //   "container": "content",
    //   "startPath": ["text_1", "content"],
    //   "startOffset": 20,
    //   "endPath": ["text_2", "content"],
    //   "endOffset": 298,
    //   "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis scelerisque ligula. Proin tristique ligula id magna finibus rhoncus. Quisque dictum viverra sapien, vel elementum metus condimentum nec. Donec ac tellus nunc. Nullam fermentum pharetra justo, accumsan tristique quam tempus a. Quisque vitae luctus velit."
    // },

    "remark_2": {
      "id": "remark_2",
      "type": "remark",
      "container": "content",
      "startPath": ["text_2", "content"],
      "startOffset": 300,
      "endPath": ["text_2", "content"],
      "endOffset": 520,
      "content": "Pellentesque eget magna porta, rutrum odio et, commodo lacus. Sed vitae vehicula ante. Quisque suscipit iaculis est, vitae aliquet lacus dictum ut."
    },

    "text_3": {
      "type": "text",
      "id": "text_3",
      "content": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis scelerisque ligula. Proin tristique ligula id magna finibus rhoncus. Quisque dictum viverra sapien, vel elementum metus condimentum nec. Donec ac tellus nunc. Nullam fermentum pharetra justo, accumsan tristique quam tempus a. Quisque vitae luctus velit. Praesent lacinia enim ex, sed pulvinar neque dictum ultricies. Sed est metus, bibendum sed suscipit ut, cursus ut mi. Pellentesque sagittis mi nisi, eu blandit metus congue id. Pellentesque eget magna porta, rutrum odio et, commodo lacus. Sed vitae vehicula ante. Quisque suscipit iaculis est, vitae aliquet lacus dictum ut. Nulla enim dolor, pulvinar at odio vitae, sollicitudin eleifend ex. Maecenas eget ligula eget sem efficitur consectetur nec vel sem. In massa mauris, consequat vitae enim eget, vehicula aliquet turpis.'
    },

    "text_4": {
      "type": "text",
      "id": "text_4",
      "content": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis scelerisque ligula. Proin tristique ligula id magna finibus rhoncus. Quisque dictum viverra sapien, vel elementum metus condimentum nec. Donec ac tellus nunc. Nullam fermentum pharetra justo, accumsan tristique quam tempus a. Quisque vitae luctus velit. Praesent lacinia enim ex, sed pulvinar neque dictum ultricies. Sed est metus, bibendum sed suscipit ut, cursus ut mi. Pellentesque sagittis mi nisi, eu blandit metus congue id. Pellentesque eget magna porta, rutrum odio et, commodo lacus. Sed vitae vehicula ante. Quisque suscipit iaculis est, vitae aliquet lacus dictum ut. Nulla enim dolor, pulvinar at odio vitae, sollicitudin eleifend ex. Maecenas eget ligula eget sem efficitur consectetur nec vel sem. In massa mauris, consequat vitae enim eget, vehicula aliquet turpis.'
    },

    "text_5": {
      "type": "text",
      "id": "text_5",
      "content": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis scelerisque ligula. Proin tristique ligula id magna finibus rhoncus. Quisque dictum viverra sapien, vel elementum metus condimentum nec. Donec ac tellus nunc. Nullam fermentum pharetra justo, accumsan tristique quam tempus a. Quisque vitae luctus velit. Praesent lacinia enim ex, sed pulvinar neque dictum ultricies. Sed est metus, bibendum sed suscipit ut, cursus ut mi. Pellentesque sagittis mi nisi, eu blandit metus congue id. Pellentesque eget magna porta, rutrum odio et, commodo lacus. Sed vitae vehicula ante. Quisque suscipit iaculis est, vitae aliquet lacus dictum ut. Nulla enim dolor, pulvinar at odio vitae, sollicitudin eleifend ex. Maecenas eget ligula eget sem efficitur consectetur nec vel sem. In massa mauris, consequat vitae enim eget, vehicula aliquet turpis.'
    }

  }
};

module.exports = sampleDoc;