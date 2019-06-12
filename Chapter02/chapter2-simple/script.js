new Vue({
    el: '#notebook',

    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage.getItem('selected-id') || null,
        }
    },

    created() {
        // 将 content 设置为存储的内容
        this.content = localStorage.getItem('content') || 'You can write in **markdown**'
    },

    computed: {
        notePreview() {
            // Markdown 渲染为 HTML
            return this.selectedNote ? marked(this.selectedNote.content) : ''
        },
        addButtonTitle() {
            return this.notes.length + ' note(s) already'
        },
        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId)
        },
        sortedNotes() {
            // 由于 sort 方法会直接修改源数组, 这里使用 slice 方法创建新的副本
            return this.notes.slice()
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
        },
        linesCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },
        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content
                // 将换行符转换为空格
                s = s.replace(/\n/g, ' ')
                // 排除开头和结尾的空格
                s = s.replace(/(^\s*)|(\s*$)/gi, ' ')
                // 将多个重复空格转换为一个
                s = s.replace(/\s\s+/gi, ' ')
                // 返回空格数量
                return s.split(' ').length
            }
        },
        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split('').length
            }
        }
    },

    watch: {
        notes: {
            handler: 'saveNotes',
            // deep 选项用来侦听数组中每个笔记属性的变化
            deep: true,
        },
        selectedId(val) {
            localStorage.setItem('selected-id', val)
        }
    },

    methods: {
        addNote() {
            const time = Date.now()
            const note = {
                id: String(time),
                title: 'New note ' + (this.notes.length + 1),
                content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Chearsheet) for formatting!',
                created: time,
                favorite: false,
            }
            this.notes.push(note)
        },
        selectNote(note) {
            this.selectedId = note.id
        },
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes))
            console.log('Notes saved!', new Date())
        },
        removeNote() {
            if (this.selectedNote && confirm('Delete the note?')) {
                const index = this.notes.indexOf(this.selectedNote)
                if (index !== -1) {
                    this.notes.splice(index, 1)
                }
            }
        },
        favoriteNote() {
            this.selectedNote.favorite ^= true
        }
    }
})

Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))
